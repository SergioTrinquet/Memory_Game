<template>
  <Message :content="contentMsg" />

  <Header 
    :displayMenu="displayMenu" 
    @on-close-menu="setDisplayMenu"
  >
    <div 
      v-for="(player, i) in players" :key="i" 
      class="player"
      :class="{ 'playing': player.turn, 'many': players.length > 1, 'three': players.length == 3 }"
    >
      <div>
        <div class="score">{{ player.score }}</div>
        <div class="number-and-name-player">
          <div class="number">j<span class="number-optional-text">oueur</span> {{ i + 1 }}</div>
          <div class="name">{{ player.nom }}</div>
        </div>
       </div>
    </div>

    <template v-slot:btn-rejouer>
      <BaseButton 
          @click="replay" 
          :outline="primaryColor" 
          :hover-bg-slide="{ color: primaryColor }" 
          rounded
      >
          Rejouer avec les mêmes paramètres
      </BaseButton>
    </template>
  </Header> 


  <div class="global-cards">   <!-- <button @click="displayConfettis">Confettis</button> --> <!-- TEST -->

    <div class="wrapper-countdown">
      <Transition name="fade-and-slide">
        <Countdown
          v-if="displayCountdown"
          @countdown-over="onCountdownOver"
        />
      </Transition>
    </div>


    <div class="wrapper-cards-nb-turns">

      <div 
        class="cards-grid" 
        v-if="displayCardsGrid"
        :style="styleGrid"
      >
        <Card 
          :nbCards="nbCards" 
          :idxCards="idxCards"  
          :stateCards="cardsState" 
          clickEvent  
          @time-to-flip="flip"   
        />
      </div>

      <NbTurnsPlayed 
        v-if="turns > 0"
        :nbTurns="turns"  
      />
      
    </div>


    <!-- <div v-else>Le nb de cartes n'a pas été sélectionné</div> -->
    <Transition name="fade">
        <ButtonChangeCardsDisposition 
          :grid-dispo-proposition="gridDispositionProposition"
          @disposition-changed="onDispositionChanged" 
          v-if="displayChangeCardsDispositonButton"
        />
    </Transition>

  </div>
</template>

<script setup>
  import BaseButton from '@/components/base/BaseButton.vue'
  import Header from '@/components/Header.vue'
  import Message from '@/components/Message.vue'
  import Card from '@/components/Card.vue'

  import { useStore } from 'vuex'
  import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
  import { useRouter } from 'vue-router'

  import { useGridResponsive } from '@/composables/useGridResponsive.js'
  import { useConfetti } from '@/composables/useConfettis'
  
  const { initGrid,  
        gridDispositionProposition, 
        styleGrid, 
        onDispositionChanged, 
        displayChangeCardsDispositonButton 
      } = useGridResponsive();
  const displayConfettis = useConfetti();

  const ButtonChangeCardsDisposition =  defineAsyncComponent(() => import(/* webpackChunkName: "ButtonChangeCardsDisposition" */ '@/components/ButtonChangeCardsDisposition.vue'))
  const Countdown = defineAsyncComponent(() => import(/* webpackChunkName: "CountDown" */ '@/components/CountDown.vue'))
  const NbTurnsPlayed = defineAsyncComponent(() => import(/* webpackChunkName: "NbTurnsPlayed" */ '@/components/NbTurnsPlayed.vue'))

  const store = useStore();
  const router = useRouter();

  const contentMsg = ref({ text: "", animationName: "" });
  const cardsState = ref([])

  const pl = computed(() => store.state.players); // Data joueurs saisis dans page 'Settings'
  const selectedNbPairOfCards = computed(() => store.state.nb_pair_of_cards);
  const nbCards = computed(() => selectedNbPairOfCards.value !== null ? parseInt(selectedNbPairOfCards.value) * 2 : 0 ); // Doit-on en faire un Getter dans Vuex ?
  const displayCardsGrid = computed(() => nbCards.value > 0 && idxCards.value.length > 0)

  const primaryColor = store.getters.getPrimaryColor

  let timeoutDisplayMenu = null;

  const players = ref([]); 
  let idxPlayer; 
  let nbPlayers = 0;
  let idxCards = ref([]);

  // Mélange des cartes
  function setShuffledIdxCards() {
    let tempoArray = []
    // On rempli le tableau de paires d'index...
    for(var i=1; i <= selectedNbPairOfCards.value; i++) {
      tempoArray.unshift(i, i);
    }
    
    // ...On shuffle
    for (let i = tempoArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = tempoArray[i];
      tempoArray[i] = tempoArray[j];
      tempoArray[j] = temp;
    }

    return tempoArray
  }

  // Gestion flip + score
  const nbMaxFlipsPerTurn = 2,  // nb maximum de carte(s) qu'il est possible de retourner par tour et par joueur
        delayDisplayMenu = 5000;
  let cardsFlippedPerTurn = [],
      nbFlipPlayer = 0,   // nb de carte(s) retournée(s) par joueur
      foundPairs = 0,   // nb de paires trouvées par l'ensemble des joueurs
      successiveFoundPairsPerPlayer = 0;
  const turns = ref(0),
        displayCountdown = ref(false);

  // Qd click sur coté verso d'une carte
  function flip(order) {
    nbFlipPlayer++;
  
    if(nbFlipPlayer <= nbMaxFlipsPerTurn) {

      cardsState.value[order] = 1 // On retourne la carte

      cardsFlippedPerTurn.push({ "idx": idxCards.value[order], "order": order }); // Enregistrement idx et order de la carte

      // Apparition Décompte secondes
      if(nbFlipPlayer == 1) displayCountdown.value = true

      if(nbFlipPlayer == nbMaxFlipsPerTurn) { // Si 2eme carte tournée...
        // On arrete le countdown si le délai max n'est pas dépassé
        displayCountdown.value = false
        turns.value += 1;

        const idx_CardsFlippedPerTurn = cardsFlippedPerTurn.map(c => c.idx);  //console.log("idx_CardsFlippedPerTurn", idx_CardsFlippedPerTurn); //TEST
        // Check si cartes identiques ou pas 
        if([...new Set(idx_CardsFlippedPerTurn)].length == 1) { // ...Si les 2 cartes retournées identiques
          flipCardsSuccess();
        } else {  // ...Sinon...
          flipCardsFailing();
        }
      }

    }
  }

  const delayBeforeMsgDisplayed = 1500;
  function flipCardsFailing() {
    setTimeout((cards) => {
        cards.forEach(c => {
          cardsState.value[c.order] = 0 // ...On retourne à nouveau les cartes
        });

        successiveFoundPairsPerPlayer = 0;

        contentMsg.value = [{ text: "<span class='icon'>😬</span> Raté!", animationName: 'fail' }];

        if(nbPlayers > 1) { // Quand plusieurs joueurs...
          players.value[idxPlayer].turn = false;
          idxPlayer += 1;
          // if(idxPlayer > nbPlayers - 1) idxPlayer = 0;  // Si la variable 'idxPlayer' dépasse le nb de joueurs, on la remet à 0
          if(idxPlayer >= nbPlayers) idxPlayer = 0;  // Si la variable 'idxPlayer' dépasse le nb de joueurs, on la remet à 0
          
          players.value[idxPlayer].turn = true;
          contentMsg.value.push({ text: ` A ton tour ${players.value[idxPlayer].nom}`, animationName: 'followingFail' });
        } 

        reinit();
      }, 
      delayBeforeMsgDisplayed, 
      cardsFlippedPerTurn)
  }

  function flipCardsSuccess() {
    setTimeout((cards) => {
      let text = "",
        animationName = "";
      cards.forEach(c => {
        cardsState.value[c.order] = 2 // Code pour dire que paire trouvée
      });

      players.value[idxPlayer].score += 1; // Incrémentation score

        // Message personnalisé qd coups gagnants successifs
      successiveFoundPairsPerPlayer++;
      const msgPart = getCongratsMessage(successiveFoundPairsPerPlayer);
      

      foundPairs += 1; // Nb de paires trouvées par l'ensemble des joueurs ou le joueur
      
      if(foundPairs == selectedNbPairOfCards.value) { // Si ttes les paires sont trouvées...
        text = getEndGameMessage(turns.value);
        animationName = 'winner';
        timeoutDisplayMenu = setTimeout(() => { displayMenu.value = true }, delayDisplayMenu);
        displayConfettis();
      } else { //...Sinon si jeu pas encore fini
        text = `!! ${msgPart} ${players.value[idxPlayer].nom.toUpperCase()} !!`;
        animationName = 'success';
      }
      contentMsg.value = { text, animationName };

      reinit();
    }, 
    delayBeforeMsgDisplayed, 
    cardsFlippedPerTurn)
  }

  // Réinitialisation après chaque tour d'un joueur
  function reinit() {
    nbFlipPlayer = 0;
    cardsFlippedPerTurn = [];
  }


  // Recup message personnalisé en fct° du nombre de succès à la suite
  const maxNbCongratsMessage = store.getters.getMaxNbCongratulationsMessage;
  function getCongratsMessage(count) {
      let id = (count > maxNbCongratsMessage ? maxNbCongratsMessage : count);
      return (count < maxNbCongratsMessage ? "" : count) + store.getters.getCongratulationsMessageById(id);
  }

  // Génération message final qd tes les cartes ont été trouvées
  function getEndGameMessage(nbTurns) {
    let msgResultatFinal = "";
    const playersScore = players.value.map(p => p.score);
    const maxScore = Math.max(...playersScore); // On détermine quel est le score max.
    let findDuplicates = playersScore => playersScore.filter((item, index) => playersScore.indexOf(item) != index); // On isole les doublons
    
    if(findDuplicates(playersScore).includes(maxScore)) { // Si plusieurs scores max. (donc plusieurs vainqueurs)...
      
      // On récupère noms des joueurs avec le plus grand score
      const equalPlayers = players.value.filter(p => p.score == maxScore);
      const namesEqualPlayers = equalPlayers.map(ep => ep.nom.toUpperCase()).join(" et ");
      msgResultatFinal += `!! 🤷 Egalité entre ${namesEqualPlayers} !!`
    
    } else { // Sinon si un seul score max: Un seul vainqueur
      
      const winner = players.value.find(p => p.score == maxScore);
      msgResultatFinal += (nbPlayers == 1) ? 
                          `👏 Bravo ${winner.nom.toUpperCase()}, partie terminée en ${nbTurns} tours` : 
                          `!! Et le/la gagnante est ${winner.nom.toUpperCase()} !!`;

    }

    return msgResultatFinal;
  }

  // Qd player n'a pas cliqué sur 2eme carte à temps (avant fin du décompte)
  function onCountdownOver() {
    contentMsg.value = { 
      text: `Trop tard ${players.value[idxPlayer].nom}`, 
      animationName: 'tooLate' 
    };
    flipCardsFailing();
    turns.value += 1; // Incrémentation du nombre de tours joués (même si pas de 2eme carte tournée)
    displayCountdown.value = false;
  }


  const displayMenu = ref(null);
  function replay() {
    newGame(); // On réinitialise
    displayMenu.value = false; // On ferme le menu
  }

  function setDisplayMenu() { displayMenu.value = null } // Réinitialisation

  function newGame() {
      // Réinitialisation variables locales
      players.value = pl.value.map(p => ({nom: p.nom, score: 0, turn: false}));
      idxPlayer = 0;
      idxCards.value = setShuffledIdxCards();
      foundPairs = 0;
      turns.value = 0;
      successiveFoundPairsPerPlayer = 0;
      cardsState.value = Array(nbCards.value).fill(0) // On réinitialise les cartes : Concrètement cela les retournent et retirent les marqueurs "founds"

      nbPlayers = players.value.length;
      if(nbPlayers > 1) players.value[idxPlayer].turn = true; // Au tour du 1er joueur
      
      clearTimeout(timeoutDisplayMenu); 

      // Msg d'intro
      contentMsg.value = [
        { text: "3", animationName: "countdown" },
        { text: "2", animationName: "countdown" },
        { text: "1", animationName: "countdown" },
        { text: "Go!", animationName: "countdown" }
      ]
    }

    ///////// TEST COMPOSABLE'useGameLogic.js' ////////
    /* const { 
        contentMsg,
        displayMenu,
        newGame,
        flip,
        onCountdownOver
      } = useGameLogic(store, displayConfettis, nbPlayers); */
    ///////// FIN TEST COMPOSABLE'useGameLogic.js' ////////


  onMounted(() => {
    if(pl.value.length == 0) { // Si pas de joueurs enregistrés (à cause d'un reload sur cette page qui réinitie ttes les propriétés du store par ex.
      router.push({ name: 'introduction' }) // Redirection vers page d'intro
    } else { // ...sinon...
      newGame(); 

      initGrid(); // Initialisation de la grille de cartes : Détermination du nb de lignes/colonnes et des dimensions de la grille en fonction de l'orientation de l'écran
    }
  });
</script>

<style scoped>
.player {
  min-width: 0;

  > div {
    display: flex;
    padding: clamp(5px, 1vw, 10px);
    margin: 0 2px;
  }

  &.playing > div {
    outline: dashed 3px #fff;
    border-radius: 6px;
    max-width: fit-content;
  }
  .score {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: hsl(312, 100%, 75%);
    color: #fff;
    border-radius: 10px;
    padding: 5px 12px;
    margin: 0 min(2vw, 10px) 0 0;
    min-width: 30px;
    text-shadow: 2px 2px hsl(350, 89%, 72%);
    font-family: 'Fredoka', sans serif;
    font-weight: 500;
  }
  .number {
    color: var(--color-tertiary);
    font-family: 'Fredoka', sans serif;
    font-weight: 500;
    font-size: clamp(15px, 2.7vmin, 22px);
  }
  .number-optional-text {
    font-family: inherit;
    font-size: inherit;
  }
  .number.increase::after {
    animation: 1s ease-in plus-one;
    content: "+1";
    position: absolute;
    z-index: 2;
    opacity: 0.2;
  }

  .name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: clamp(18px, 3.8vmin, 28px);
  }
}

@media screen and (max-width: 480px) {
  .player.three {
    .number-optional-text {
      width: 0px;
      display: inline-flex;
      overflow: hidden;
      margin: 0 3px 0 0;
      &::after {
        content: ".";
        position: absolute;
      }
    }
  } 
}
@keyframes plus-one {
  0% { opacity: 0; margin-top: 5vh; transform: scale(1); }
  100% {  opacity: 1; margin-top: 0vh; transform: scale(2); }
}

.number-and-name-player {
  line-height: clamp(19px, 3.3vmin, 25px);
  min-width: 0;
}

.wrapper-countdown {
  height: 6vh;
  display: flex;
  align-items: center;
}

.global-cards {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.cards-grid {
  display: grid; 
  gap: 10px;
  max-height: 70vh;
  max-width: min(80vw, 780px);

  /* TEST */
  /* width: min(750px, 80vw); */
  /* FIN TEST */

  @media screen and (max-width: 480px) {
    gap: 9px;
  }
  @media screen and (max-width: 400px) {
    gap: 8px;
  }
  @media screen and (max-width: 300px) {
    gap: 7px;
  }
}

.wrapper-cards-nb-turns {
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-and-slide-enter-active,
.fade-and-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-and-slide-enter-from,
.fade-and-slide-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@media screen and (min-aspect-ratio: 2 / 1) and (max-height: 600px) {
  .cards-grid,
  :deep(.msg-countdown),
  :deep(.wrapper-bt-change-disposition),
  :deep(.nb-tours) {
    transform: translateX(-8vw);
  }
  .player {
    margin: 2vh 0;
    &.many { 
      width: 80%; 
    }
    &.playing > div {
      max-width: none;
    }
  }
}
</style>