<template>
  <Message :content="contentMsg" />

  <Header 
    :displayMenu="displayMenu" 
    @on-close-menu="setDisplayMenu"
  >
    <div 
      v-for="(player, i) in players" :key="i" 
      class="player"
      :class="{ 'playing': player.turn }"
    >
      <div>
        <div class="score">{{ player.score }}</div>
        <div class="nbName">
          <div class="number">joueur {{ i + 1 }}</div>
          <div class="name">{{ player.nom }}</div>
        </div>
       </div>
    </div>

    
    <div class="nb-tours" v-show="turns > 0">
      {{ nbPlayedTurns }}: {{ turns }}
    </div>
    
    <template v-slot:btn-rejouer>
      <button @click="replay">Rejouer avec les mêmes paramètres</button>
    </template>
  </Header> 


  <Countdown
    v-if="displayCountdown"
    @countdown-over="onCountdownOver"
  />
  

  <div class="global-cards">   <!-- <button @click="displayConfettis">Confettis</button> --> <!-- TEST -->

    <div 
      class="cards-grid" 
      v-if="displayCardsGrid"
      :style="styleContainer"
    >

      <div class="flip-card"
        v-for="(card, i) in nbCards" :key="i" 
        :data-order="i"
        :data-idx="idxCards[i]"
      >
        <div class="flip-card-inner">
          <div class="flip-card-front" @click="flip">
            <!-- <div>{{ i + 1 }}</div> --><div>{{ idxCards[i] }}</div>
          </div>
          <div 
            class="flip-card-back" 
            :style="loadImg(idxCards[i])"
          ></div>
        </div>
      </div>

    </div>


    <!-- <div v-else>Le nb de cartes n'a pas été sélectionné</div> -->
    <Transition name="fade">
        <ButtonChangeCardsDisposition 
          :grid-dispo-proposition="gridDispositionProposition"
          @disposition-changed="onDispositionChanged" 
          v-if="displayComponentButtonChangeCardsDisposition"
        />
    </Transition>

  </div>

</template>

<script setup>
  import Header from '@/components/Header.vue'
  import Message from '@/components/Message.vue'

  import { useStore } from 'vuex'
  import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue'
  import { useRouter } from 'vue-router'

  import JSConfetti from 'js-confetti'

  const ButtonChangeCardsDisposition =  defineAsyncComponent(() => import(/* webpackChunkName: "ButtonChangeCardsDisposition" */ '@/components/ButtonChangeCardsDisposition.vue'))
  const displayComponentButtonChangeCardsDisposition = ref(false)

  const Countdown = defineAsyncComponent(() => import(/* webpackChunkName: "CountDown" */ '@/components/CountDown.vue'))

  const store = useStore();
  const router = useRouter();

  
  const contentMsg = ref(null); // Message

  const pl = computed(() => store.state.players); // Data joueurs saisies dans page 'Settings'

  const selectedNbPairOfCards = computed(() => store.state.nb_pair_of_cards);
  const nbCards = computed(() => selectedNbPairOfCards.value !== null ? parseInt(selectedNbPairOfCards.value) * 2 : 0 ); // Doit-on en faire un Getter dans Vuex ?

  // Partie Theme
  const selectedTheme = computed(() => store.state.theme);
  const prefix = computed(() => {
    const obj = store.state.option_themes.find(ot => ot.intitule == selectedTheme.value); 
    return (typeof obj !== "undefined") ? obj.prefix : "";
  });
  //console.log("prefix", prefix.value); //TEST

  const displayCardsGrid = computed(() => nbCards.value > 0 && idxCards.value.length > 0)

    /* NVELLE VERSION */
  const players = ref([]); 
  let idxPlayer; 
  let nbPlayers = 0;
  let idxCards = ref([]);
   /* FIN NVELLE VERSION */



  // Images cartes
  function fillImgsCards() {
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
  //console.log("idxCards", idxCards.value); //TEST
  

  // Chargement image carte
  function loadImg(i) {
    const path = require(`@/assets/imgs/${selectedTheme.value}/${prefix.value}_${parseInt(i + 1)}.png`);
    return { 'background-image': `url(${path})`, 'background-size': 'cover' };
  } 


  // Gestion flip + score
  const nbMaxFlipsPerTurn = 2;  // nb maximum de carte(s) qu'il est possible de retourner par tour et par joueur
  let cardsFlippedPerTurn = [],
      nbFlipPlayer = 0,   // nb de carte(s) retournée(s) par joueur
      foundPairs = 0,   // nb de paires trouvées par l'ensemble des joueurs
      successiveFoundPairsPerPlayer = 0,
      jsConfetti = undefined;
  const turns = ref(0);

  const delayDisplayMenu = 5000;
  
  const nbPlayedTurns = computed(() => {
    const pluriel = (turns.value > 1) ? "s" : ""
    return `Tour${pluriel} joué${pluriel}`
  })


  const displayCountdown = ref(false)

  function flip(e) {
    nbFlipPlayer++;
  
    if(nbFlipPlayer <= nbMaxFlipsPerTurn) {

      const card = e.target.closest(".flip-card");
      card.classList.toggle("flipped"); // On retourne la carte

      const order = card.dataset.order; 
      const idx = card.dataset.idx; 
      cardsFlippedPerTurn.push({ "idx": idx, "order": order }); // Enregistrement idx et order de la carte

      // Apparition Décompte secondes
      if(nbFlipPlayer == 1) displayCountdown.value = true

      if(nbFlipPlayer == nbMaxFlipsPerTurn) { // Si 2eme carte tournée...

        // On arrete le countdown si le délai max n'est pas dépassé
        displayCountdown.value = false

        turns.value += 1;

        const idx_CardsFlippedPerTurn = cardsFlippedPerTurn.map(c => c.idx);  //console.log("idx_CardsFlippedPerTurn", idx_CardsFlippedPerTurn); //TEST
        // Check si cartes identiques ou pas 
        if([...new Set(idx_CardsFlippedPerTurn)].length == 1) { // ...Si les 2 cartes retournées identiques
          
          /* 
          let text = "",
            animationName = undefined;
          
          setTimeout((cards) => {
            cards.forEach(c => {
              document.querySelector(`.flip-card[data-order="${c.order}"]`).classList.add("found"); // Marqueur comme quoi trouvées
            });

            players.value[idxPlayer].score += 1; // Incrémentation score

             // Message personnalisé qd coups gagnants successifs
            successiveFoundPairsPerPlayer++;
            const msgPart = getWordsForMsg(successiveFoundPairsPerPlayer);
            

            foundPairs += 1; // Nb de paires trouvées par l'ensemble des joueurs ou le joueur
           
            if(foundPairs == selectedNbPairOfCards.value) { // Si ttes les paires sont trouvées...
              text = msgEndOfTheGame(turns.value);
              setTimeout(() => { displayMenu.value = true }, delayDisplayMenu);
              animationName = 'winner';
              displayConfettis();
            } else { //...Sinon si jeu pas encore fini
              text = `!! ${msgPart} ${players.value[idxPlayer].nom.toUpperCase()} !!`;
              animationName = 'success';
            }
            contentMsg.value = { text, animationName };

            reinit();
          }, 
          1500, 
          cardsFlippedPerTurn) */

          flipCardsSuccess(); // TEST

        } else {  // ...Sinon...

          /* setTimeout((cards) => {
            cards.forEach(c => {
              document.querySelector(`.flip-card[data-order="${c.order}"]`).classList.toggle("flipped"); // ...On retourne à nouveau les cartes
            });

            successiveFoundPairsPerPlayer = 0;

            contentMsg.value = [{ text: "😬 Raté!", animationName: 'fail' }];
            if(nbPlayers > 1) { // Quand plusieurs joueurs...
              players.value[idxPlayer].turn = false;
              idxPlayer += 1;
              if(idxPlayer > nbPlayers - 1) idxPlayer = 0;  // Si la variable 'idxPlayer' dépasse le nb de joueurs, on la remet à 0
              
              players.value[idxPlayer].turn = true;
              contentMsg.value.push({ text: ` A ton tour ${players.value[idxPlayer].nom}`, animationName: 'followingFail' });
            } 

            // TEST : A VIRER //contentMsg.value = [{ text, animationName }, { text: "text 2", animationName }, { text: "text 3", animationName }];

            reinit();

          }, 
          1500, 
          cardsFlippedPerTurn) */

          flipCardsFailing(); //TEST
        }
        
      }


    } /* else {
      //console.log("Plus de 2 clics pour le meme joueur! PAS BIEN") //TEST
      // FAIRE EN SORTE QUE CURSOR SOIT NOT ALLOWED QD CARD SURVOLEE
    } */

  }


  //////// TEST ///////
  function flipCardsFailing() {
    setTimeout((cards) => {
        cards.forEach(c => {
          document.querySelector(`.flip-card[data-order="${c.order}"]`).classList.toggle("flipped"); // ...On retourne à nouveau les cartes
        });

        successiveFoundPairsPerPlayer = 0;
        contentMsg.value = [{ text: "😬 Raté!", animationName: 'fail' }];

        if(nbPlayers > 1) { // Quand plusieurs joueurs...
          players.value[idxPlayer].turn = false;
          idxPlayer += 1;
          if(idxPlayer > nbPlayers - 1) idxPlayer = 0;  // Si la variable 'idxPlayer' dépasse le nb de joueurs, on la remet à 0
          
          players.value[idxPlayer].turn = true;
          contentMsg.value.push({ text: ` A ton tour ${players.value[idxPlayer].nom}`, animationName: 'followingFail' });
        } 

        reinit();
      }, 
      1500, 
      cardsFlippedPerTurn)
  }


  function flipCardsSuccess() {
    let text = "",
        animationName = undefined;

    setTimeout((cards) => {
      cards.forEach(c => {
        document.querySelector(`.flip-card[data-order="${c.order}"]`).classList.add("found"); // Marqueur comme quoi trouvées
      });

      players.value[idxPlayer].score += 1; // Incrémentation score

        // Message personnalisé qd coups gagnants successifs
      successiveFoundPairsPerPlayer++;
      const msgPart = getWordsForMsg(successiveFoundPairsPerPlayer);
      

      foundPairs += 1; // Nb de paires trouvées par l'ensemble des joueurs ou le joueur
      
      if(foundPairs == selectedNbPairOfCards.value) { // Si ttes les paires sont trouvées...
        text = msgEndOfTheGame(turns.value);
        setTimeout(() => { displayMenu.value = true }, delayDisplayMenu);
        animationName = 'winner';
        displayConfettis();
      } else { //...Sinon si jeu pas encore fini
        text = `!! ${msgPart} ${players.value[idxPlayer].nom.toUpperCase()} !!`;
        animationName = 'success';
      }
      contentMsg.value = { text, animationName };

      reinit();
    }, 
    1500, 
    cardsFlippedPerTurn)
  }
  /////// FIN TEST ////////


  // Réinitialisation après chaque tour d'un joueur
  function reinit() {
    nbFlipPlayer = 0;
    cardsFlippedPerTurn = [];
  }


  // Recup message personnalisé en fct° du nombre de sucès à la suite
  const maxNbCongratulationsMessage = store.getters.getMaxNbCongratulationsMessage;
  function getWordsForMsg(i) {
    let j = (i > maxNbCongratulationsMessage ? maxNbCongratulationsMessage : i),
        k = (i < maxNbCongratulationsMessage ? "" : i);
    return k + store.getters.getCongratulationsMessageById(j);
  }


  // Affichage confettis
  async function displayConfettis() {
    jsConfetti = new JSConfetti() // Création canvas pour confettis
    /*
    jsConfetti.addConfetti()  // Affichage confettis
      .then(() => document.querySelector('canvas').remove()); // Qd confettis disparaisent, suppression canvas affichant confettis
    */
    await jsConfetti.addConfetti({
      confettiNumber: 500,
      confettiRadius: 10,
    });  // Affichage confettis
    await jsConfetti.addConfetti({
      emojis: ['🌈', '✨', '🌸'],
      emojiSize: 25
    });
    await jsConfetti.addConfetti({
      confettiNumber: 500
    });
    document.querySelector('canvas').remove(); // Qd confettis disparaisent, suppression canvas affichant confettis
  }


  // Génération message final qd tes les cartes ont été trouvées
  function msgEndOfTheGame(nbTurns) {
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


  /* TEST: NVELLE VERSION */
  const displayMenu = ref(null);
  function replay() {
    document.querySelectorAll(".flip-card").forEach(fc => fc.classList.remove("flipped", "found")); // On retourne les cartes et les marqueurs "founds"
    newGame(); // On réinitialise
    displayMenu.value = false; // On ferme le menu
  }

  function setDisplayMenu() { displayMenu.value = null } // Réinitialisation

  function newGame() {
      // Réinitialisation variables locales
      players.value = pl.value.map(p => ({nom: p.nom, score: 0, turn: false}));
      idxPlayer = 0;
      idxCards.value = fillImgsCards();
      foundPairs = 0;
      turns.value = 0;
      successiveFoundPairsPerPlayer = 0;
  }
  /* FIN TEST: NVELLE VERSION */




  const gridDisposition = reactive({  rows: 0, columns: 0 })
  const gridDimensions = reactive({ width: 0, height: 0 })  
  const gridTemplateAreasStyle = ref([])

  const getOrientation = () =>  (window.matchMedia("(min-aspect-ratio:1/1)").matches) ? "paysage" : "portrait"

  // Attributs de style de la grille
  const styleContainer = computed(() => {
    return {
        'grid-template-columns': `repeat(${gridDisposition.columns}, minmax(0, 1fr))`,
        'grid-template-rows': `repeat(${gridDisposition.rows}, minmax(0, 1fr))`,
        'grid-template-areas': gridTemplateAreasStyle.value,
        'aspect-ratio': `${gridDisposition.columns} / ${gridDisposition.rows}`,
        // Solution n°1 qui fonctionne mais pas top visuellement
        //'height': '70vh'
        // Solution n°2
        'width': gridDimensions.width,
        'height': gridDimensions.height
      }
  })



  // Pour générer les areas de la prop. 'grid-template-areas'
  function setGridTemplateAreasStyle() {
    const columns = gridDisposition.columns;
    const rows = gridDisposition.rows;

    let valAttributeGTA = [];
    let k = 1;
    for(var i = 1; i <= rows; i++) {
      var lgn = "";
      for(var j = 1; j <= columns; j++) {
        lgn += `div${k} `
        k++;
      }
      valAttributeGTA.push(`"${lgn.trim()}"`);
    }
    gridTemplateAreasStyle.value = valAttributeGTA.join(" ");
  }


  function setGridWidthAndHeightStyle() {
    const columns = gridDisposition.columns;
    const rows = gridDisposition.rows;

    // Affectation variables servant à déterminer largeur ou hauteur de la grille de cartes afin que celle-ci ne déborde jamais de l'écran :
    // Détermination du point de bascule entre hauteur fixe / largeur auto, et largeur fixe / hauteur auto.
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    const proportionMaxWidthGrid = 0.8; // Pour 80vw
    const proportionMaxHeightGrid = 0.7; // Pour 70vh

    let width_cardsGrid, height_cardsGrid = "";
    const lengthSideCard = windowWidth * proportionMaxWidthGrid / columns;

    if((lengthSideCard * rows) >= (windowHeight * proportionMaxHeightGrid)) { // Si la hauteur de la grille dépasse la hauteur max autorisée (ici 70vh)...
      width_cardsGrid = "auto";
      height_cardsGrid = `${(proportionMaxHeightGrid * 100)}vh`;
    } else {
      width_cardsGrid = `${(proportionMaxWidthGrid * 100)}vw`;
      height_cardsGrid = "auto";
    }
    gridDimensions.width = width_cardsGrid;
    gridDimensions.height = height_cardsGrid;
  }



  const gridDispositionProposition = reactive({ rows: 0, columns: 0  })
  let lastValOrientation = "" 

  function setGridRowsAndColumnsProposition() {
        const orientation = getOrientation();

        // Prevoir cas changement orientation mobile/tablette
        /* if(window.matchMedia("(hover:hover)").matches) {
            console.log("Ordi"); //TEST
        } else {
        console.log("Mobile/Tablette"); //TEST
        //if(window.matchMedia("orientation: portrait").matches) { }
        } */
        
        if(orientation !== lastValOrientation) { // Si changement orientation...
            // Récup nb lignes et colonnes idéals de la grid en fct° de l'orientation de l'écran
            const { columns, rows } = store.getters.getSelectedNbPairOfCardsData(orientation);
            // Affectation de ces données à variable 'gridDispositionProposition'
            setGridDisposition({ columns, rows }, gridDispositionProposition);

            // Affichage bouton pour demander à l'utilisateur s'il veut changer la dispo des cartes
            displayComponentButtonChangeCardsDisposition.value = (gridDispositionProposition.rows !== gridDisposition.rows) ? true : false;
        }
        lastValOrientation = orientation;
    }

 
  let sto = null;
  window.addEventListener("resize", () => {
    // Appel fonction que qd event 'resize' s'arrête pour des raisons de performance
    clearTimeout(sto);
    sto = setTimeout(() =>{ 
      setGridRowsAndColumnsProposition();
      setGridWidthAndHeightStyle()  // Pour obtenir les valeurs des propriétés CSS 'width' et 'height'
    }, 500); 
  })


  // Appelé qd click sur bt ds composant enfant pour changer disposition des cartes
  function onDispositionChanged() {   
    setGridDisposition(gridDispositionProposition, gridDisposition); // MAJ données gridDisposition       
    setGridTemplateAreasStyle(); // 1. Update CSS 'grid-template-areas'
    setGridWidthAndHeightStyle(); // 2. Update CSS 'width' et 'height'
    displayComponentButtonChangeCardsDisposition.value = false; // Disparition composant bouton
  }


  function setGridDisposition(gridDispoFrom, gridDispoTo) {
      if('rows' in gridDispoFrom) gridDispoTo.rows = gridDispoFrom.rows;
      if('columns' in gridDispoFrom) gridDispoTo.columns = gridDispoFrom.columns;
  }


  onMounted(() => {
    if(pl.value.length == 0) { // Si pas de joueurs enregistrés (à cause d'un reload sur cette page qui réinitie ttes les propriétés du store par ex.
      router.push({ name: 'introduction' }) // Redirection vers page d'intro
    } else { // ...sinon...
      newGame(); 

      // Affichage grille de cartes : Pour déterminer le nb de lignes/colonnes 
      // de la grille de cartes en fonction de l'orientation de l'écran
      const { columns, rows } = store.getters.getSelectedNbPairOfCardsData(getOrientation());
      setGridDisposition({ rows, columns }, gridDisposition);

      setGridWidthAndHeightStyle(); // Calcul largeur/hauteur grille
      setGridTemplateAreasStyle(); // Pour obtenir la valeur de la propriété CSS 'grid-template-areas'


      nbPlayers = players.value.length;
      if(nbPlayers > 1) players.value[idxPlayer].turn = true; // Au tour du 1er joueur

      // Msg d'intro
      contentMsg.value = [
        { text: "3", animationName: "countdown" },
        { text: "2", animationName: "countdown" },
        { text: "1", animationName: "countdown" },
        { text: "Go!", animationName: "countdown" }
      ]
    }
  });
</script>

<style scoped>
.player {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
.player > div {
  display: flex;
  padding: 10px;
}
.player.playing > div {
  border: dashed 3px #fff;
  border-radius: 6px;
}
.player .score {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F052D0;
  color: #fff;
  border-radius: 30%;
  padding: 5px 12px;
  margin: 0 10px 0 0;
  font-weight: bold;
}
.player .number {
  color: rgb(241, 237, 0);
}
.player .number.increase::after {
  animation: 1s ease-in plusOne;
  content: "+1";
  position: absolute;
  z-index: 2;
  opacity: 0.2;
}
@keyframes plusOne {
  0% { opacity: 0; margin-top: 5vh; transform: scale(1); }
  100% {  opacity: 1; margin-top: 0vh; transform: scale(2); }
}
.player .name {
  display: inline-block;
}

.nbName {
  line-height: 3vh;
}

.global-cards {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.cards-grid {
  border: dotted 1px #fff; /* TEST */
  display: grid; 
  /* grid-template-columns: 1fr 1fr 1fr; 
  grid-template-rows: 1fr 1fr;
  grid-template-areas: 
    "div1 div2 div3"
    "div4 div5 div6"; */ 
  gap: 10px 10px;
  max-height: 70vh;
  max-width: min(80vw, 780px);
}
.cards-grid > div:first-child { grid-area: div1; }
.cards-grid > div:nth-child(2) { grid-area: div2; }
.cards-grid > div:nth-child(3) { grid-area: div3; }
.cards-grid > div:nth-child(4) { grid-area: div4; }
.cards-grid > div:nth-child(5) { grid-area: div5; }
.cards-grid > div:nth-child(6) { grid-area: div6; }
.cards-grid > div:nth-child(7) { grid-area: div7; }
.cards-grid > div:nth-child(8) { grid-area: div8; }
.cards-grid > div:nth-child(9) { grid-area: div9; }
.cards-grid > div:nth-child(10) { grid-area: div10; }
.cards-grid > div:nth-child(11) { grid-area: div11; }
.cards-grid > div:nth-child(12) { grid-area: div12; }
.cards-grid > div:nth-child(13) { grid-area: div13; }
.cards-grid > div:nth-child(14) { grid-area: div14; }
.cards-grid > div:nth-child(15) { grid-area: div15; }
.cards-grid > div:nth-child(16) { grid-area: div16; }
.cards-grid > div:nth-child(17) { grid-area: div17; }
.cards-grid > div:nth-child(18) { grid-area: div18; }
.cards-grid > div:nth-child(19) { grid-area: div19; }
.cards-grid > div:nth-child(20) { grid-area: div20; }
.cards-grid > div:nth-child(21) { grid-area: div21; }
.cards-grid > div:nth-child(22) { grid-area: div22; }
.cards-grid > div:nth-child(23) { grid-area: div23; }
.cards-grid > div:nth-child(24) { grid-area: div24; }
.cards-grid > div:nth-child(25) { grid-area: div25; }
.cards-grid > div:nth-child(26) { grid-area: div26; }
.cards-grid > div:nth-child(27) { grid-area: div27; }
.cards-grid > div:nth-child(28) { grid-area: div28; }
.cards-grid > div:nth-child(29) { grid-area: div29; }
.cards-grid > div:nth-child(30) { grid-area: div30; }

.flip-card {
  background-color: transparent;
  perspective: 1000px;
  width: 100%;
  padding-top: 100%;
  justify-self: center;
  align-self: center;
  position: relative; /* Vraiment utile ? */
}
.flip-card.found .flip-card-back::after {
  display: inline-block;
  content: "✔️"; 
  font-size: min(5vw, 50px);

  /* content: "trouvé !"; */
  background-color: rgba(92, 3, 165, 0.4);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.flip-card-inner {  
  position: absolute;
        z-index: 1;
  top: 0%;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 10px 20px rgba(0,0,0,0.4);
}
/* .flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
} */
.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}
.flip-card-front, 
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 6px;
}
.flip-card-front {
  cursor: pointer;
  background-color: #f7ff1f;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='52' viewBox='0 0 52 52'%3E%3Cpath fill='%23ed25ff' fill-opacity='0.82' d='M0 17.83V0h17.83a3 3 0 0 1-5.66 2H5.9A5 5 0 0 1 2 5.9v6.27a3 3 0 0 1-2 5.66zm0 18.34a3 3 0 0 1 2 5.66v6.27A5 5 0 0 1 5.9 52h6.27a3 3 0 0 1 5.66 0H0V36.17zM36.17 52a3 3 0 0 1 5.66 0h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 0 1 0-5.66V52H36.17zM0 31.93v-9.78a5 5 0 0 1 3.8.72l4.43-4.43a3 3 0 1 1 1.42 1.41L5.2 24.28a5 5 0 0 1 0 5.52l4.44 4.43a3 3 0 1 1-1.42 1.42L3.8 31.2a5 5 0 0 1-3.8.72zm52-14.1a3 3 0 0 1 0-5.66V5.9A5 5 0 0 1 48.1 2h-6.27a3 3 0 0 1-5.66-2H52v17.83zm0 14.1a4.97 4.97 0 0 1-1.72-.72l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1 0-5.52l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43c.53-.35 1.12-.6 1.72-.72v9.78zM22.15 0h9.78a5 5 0 0 1-.72 3.8l4.44 4.43a3 3 0 1 1-1.42 1.42L29.8 5.2a5 5 0 0 1-5.52 0l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1-.72-3.8zm0 52c.13-.6.37-1.19.72-1.72l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43a5 5 0 0 1 5.52 0l4.43-4.43a3 3 0 1 1 1.42 1.41l-4.44 4.43c.36.53.6 1.12.72 1.72h-9.78zm9.75-24a5 5 0 0 1-3.9 3.9v6.27a3 3 0 1 1-2 0V31.9a5 5 0 0 1-3.9-3.9h-6.27a3 3 0 1 1 0-2h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 1 1 2 0v6.27a5 5 0 0 1 3.9 3.9h6.27a3 3 0 1 1 0 2H31.9z'%3E%3C/path%3E%3C/svg%3E");
  box-shadow: 0 0 0 5px #fff inset;
}
.flip-card-back {
  background-color: #bbb;
  transform: rotateY(180deg);
}

.flip-card-front > div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
}

.nb-tours {
  font-size: clamp(17px, 3vmin, 24px);
  line-height: 2.5vh;
  width: clamp(45px, 10vw, 130px);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: var(--color-3);
  margin: calc(var(--margin-header) * -1) 0 0 0;
  padding: 1vw;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>