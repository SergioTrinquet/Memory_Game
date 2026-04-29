<template>
  <Message 
    :content="contentMsg" 
    :clear="clearMsg" 
    @on-msg-cleared="setClearMsg"
  />

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

  import { onMounted, defineAsyncComponent, computed } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'

  import { useGridResponsive } from '@/composables/useGridResponsive.js'
  import { useGameLogic } from '@/composables/useGameLogic.js'

  // Composants asynchrones
  const ButtonChangeCardsDisposition =  defineAsyncComponent(() => import(/* webpackChunkName: "ButtonChangeCardsDisposition" */ '@/components/ButtonChangeCardsDisposition.vue'))
  const Countdown = defineAsyncComponent(() => import(/* webpackChunkName: "CountDown" */ '@/components/CountDown.vue'))
  const NbTurnsPlayed = defineAsyncComponent(() => import(/* webpackChunkName: "NbTurnsPlayed" */ '@/components/NbTurnsPlayed.vue'))

  const store = useStore();
  const router = useRouter();
  const primaryColor = computed(() => store.getters.getPrimaryColor);

  // Logique de la grille responsive
  const { 
    initGrid,  
    gridDispositionProposition, 
    styleGrid, 
    onDispositionChanged, 
    displayChangeCardsDispositonButton 
  } = useGridResponsive();

  // Logique du jeu
  const {
    contentMsg,
    displayMenu,
    players,
    cardsState,
    turns,
    displayCountdown,
    idxCards,
    nbCards,
    displayCardsGrid,
    clearMsg,
    newGame,
    flip,
    onCountdownOver,
    replay,
    setDisplayMenu,
    setClearMsg
  } = useGameLogic(store);

  onMounted(() => {
    if (store.state.players.length === 0) { // Si pas de joueurs enregistrés (à cause d'un reload sur cette page qui réinitie ttes les propriétés du store par ex.) : Redirection vers page d'intro
      router.push({ name: 'introduction' });
    } else {
      newGame(); 
      initGrid();
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