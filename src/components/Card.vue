<template>
    <div class="flip-card"
        v-for="(card, i) in props.nbCards" :key="i" 
        :data-order="i"
        :class="cardState(i)"
    >
        <div class="flip-card-inner">
          <div v-if="props.clickEvent" @click="emiFlip" class="flip-card-front"><div>{{ indexCards[i] }}</div></div>
          <div v-else class="flip-card-front"><div>{{ indexCards[i] }}</div></div>
          <div 
            class="flip-card-back" 
            :style="loadImg(indexCards[i])"
          ></div>
        </div>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits, computed } from 'vue'
    import { useStore } from 'vuex'
        
    // Les props
    const props = defineProps({ 
        nbCards: {
            type: Number,
            required: false,
            default: 1
        }, 
        idxCards: {
            type: [Array, Number],
            required: true
        },
        clickEvent: {
            type: Boolean,
            required: false,
            default: false
        },
        stateCards: {
            type: [Array, Number],
            required: true
        }
    })


    const indexCards = computed(() => setArrayIfNot(props.idxCards))
    const stateOfCards = computed(() => setArrayIfNot(props.stateCards))
    function setArrayIfNot(prop) {
        if(typeof prop == 'number') return [prop]
        return prop
    }

    // class CSS illustrant les différents états d'une carte (par défaut/retournée/retournée et trouvée avec sa paire)
    const cardState = (i) => {
        if(stateOfCards.value[i] == 1) return 'flipped'
        else if(stateOfCards.value[i] == 2) return 'flipped found'
        else return ''
    }


    // Chargement image carte
    const store = useStore()
    const selectedTheme = computed(() => store.state.theme !== null ? store.state.theme : store.state.option_themes[0].intitule); // Soit on récpère le thème sélectionné par l'utilisateur, soit s'il n'y en a pas, on prend le 1er dans la liste des thèmes
    const prefix = computed(() => {
        const obj = store.state.option_themes.find(ot => ot.intitule == selectedTheme.value); 
        return (typeof obj !== "undefined") ? obj.prefix : "";
    });
    
    function loadImg(i) {
        const path = require(`@/assets/imgs/${selectedTheme.value}/${prefix.value}_${parseInt(i + 1)}.png`);
        return { 'background-image': `url(${path})` };
    } 


    // Emit pour execut° fonction flip dans composant parent
    const emit = defineEmits(['timeToFlip'])
    function emiFlip(e) {
        emit('timeToFlip', e);
    }
</script>

<style>
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
        font-size: min(8vmin, 50px);
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
    .flip-card.flipped .flip-card-inner {
        transform: rotateY(180deg);
    }

    .flip-card.flipped .flip-card-front {
        pointer-events: none;
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
    @media screen and (max-width: 480px) {
        .flip-card-front, 
        .flip-card-back {
            border-radius: 4px;
        }
    }
    .flip-card-front {
        cursor: pointer;
        background-color: #f7ff1f;
        box-shadow: 0 0 0 min(5px, 0.5vmax) #fff inset;
    }
    @media screen and (min-width: 801px) {
        .flip-card-front {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='52' viewBox='0 0 52 52'%3E%3Cpath fill='%23ed25ff' fill-opacity='0.82' d='M0 17.83V0h17.83a3 3 0 0 1-5.66 2H5.9A5 5 0 0 1 2 5.9v6.27a3 3 0 0 1-2 5.66zm0 18.34a3 3 0 0 1 2 5.66v6.27A5 5 0 0 1 5.9 52h6.27a3 3 0 0 1 5.66 0H0V36.17zM36.17 52a3 3 0 0 1 5.66 0h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 0 1 0-5.66V52H36.17zM0 31.93v-9.78a5 5 0 0 1 3.8.72l4.43-4.43a3 3 0 1 1 1.42 1.41L5.2 24.28a5 5 0 0 1 0 5.52l4.44 4.43a3 3 0 1 1-1.42 1.42L3.8 31.2a5 5 0 0 1-3.8.72zm52-14.1a3 3 0 0 1 0-5.66V5.9A5 5 0 0 1 48.1 2h-6.27a3 3 0 0 1-5.66-2H52v17.83zm0 14.1a4.97 4.97 0 0 1-1.72-.72l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1 0-5.52l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43c.53-.35 1.12-.6 1.72-.72v9.78zM22.15 0h9.78a5 5 0 0 1-.72 3.8l4.44 4.43a3 3 0 1 1-1.42 1.42L29.8 5.2a5 5 0 0 1-5.52 0l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1-.72-3.8zm0 52c.13-.6.37-1.19.72-1.72l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43a5 5 0 0 1 5.52 0l4.43-4.43a3 3 0 1 1 1.42 1.41l-4.44 4.43c.36.53.6 1.12.72 1.72h-9.78zm9.75-24a5 5 0 0 1-3.9 3.9v6.27a3 3 0 1 1-2 0V31.9a5 5 0 0 1-3.9-3.9h-6.27a3 3 0 1 1 0-2h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 1 1 2 0v6.27a5 5 0 0 1 3.9 3.9h6.27a3 3 0 1 1 0 2H31.9z'%3E%3C/path%3E%3C/svg%3E");
        }
    }
    @media screen and (min-width: 501px) and (max-width: 800px) {
        .flip-card-front {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 52 52'%3E%3Cpath fill='%23ed25ff' fill-opacity='0.82' d='M0 17.83V0h17.83a3 3 0 0 1-5.66 2H5.9A5 5 0 0 1 2 5.9v6.27a3 3 0 0 1-2 5.66zm0 18.34a3 3 0 0 1 2 5.66v6.27A5 5 0 0 1 5.9 52h6.27a3 3 0 0 1 5.66 0H0V36.17zM36.17 52a3 3 0 0 1 5.66 0h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 0 1 0-5.66V52H36.17zM0 31.93v-9.78a5 5 0 0 1 3.8.72l4.43-4.43a3 3 0 1 1 1.42 1.41L5.2 24.28a5 5 0 0 1 0 5.52l4.44 4.43a3 3 0 1 1-1.42 1.42L3.8 31.2a5 5 0 0 1-3.8.72zm52-14.1a3 3 0 0 1 0-5.66V5.9A5 5 0 0 1 48.1 2h-6.27a3 3 0 0 1-5.66-2H52v17.83zm0 14.1a4.97 4.97 0 0 1-1.72-.72l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1 0-5.52l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43c.53-.35 1.12-.6 1.72-.72v9.78zM22.15 0h9.78a5 5 0 0 1-.72 3.8l4.44 4.43a3 3 0 1 1-1.42 1.42L29.8 5.2a5 5 0 0 1-5.52 0l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1-.72-3.8zm0 52c.13-.6.37-1.19.72-1.72l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43a5 5 0 0 1 5.52 0l4.43-4.43a3 3 0 1 1 1.42 1.41l-4.44 4.43c.36.53.6 1.12.72 1.72h-9.78zm9.75-24a5 5 0 0 1-3.9 3.9v6.27a3 3 0 1 1-2 0V31.9a5 5 0 0 1-3.9-3.9h-6.27a3 3 0 1 1 0-2h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 1 1 2 0v6.27a5 5 0 0 1 3.9 3.9h6.27a3 3 0 1 1 0 2H31.9z'%3E%3C/path%3E%3C/svg%3E");
        }
    }
    @media screen and (max-width: 500px) {
        .flip-card-front {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 52 52'%3E%3Cpath fill='%23ed25ff' fill-opacity='0.82' d='M0 17.83V0h17.83a3 3 0 0 1-5.66 2H5.9A5 5 0 0 1 2 5.9v6.27a3 3 0 0 1-2 5.66zm0 18.34a3 3 0 0 1 2 5.66v6.27A5 5 0 0 1 5.9 52h6.27a3 3 0 0 1 5.66 0H0V36.17zM36.17 52a3 3 0 0 1 5.66 0h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 0 1 0-5.66V52H36.17zM0 31.93v-9.78a5 5 0 0 1 3.8.72l4.43-4.43a3 3 0 1 1 1.42 1.41L5.2 24.28a5 5 0 0 1 0 5.52l4.44 4.43a3 3 0 1 1-1.42 1.42L3.8 31.2a5 5 0 0 1-3.8.72zm52-14.1a3 3 0 0 1 0-5.66V5.9A5 5 0 0 1 48.1 2h-6.27a3 3 0 0 1-5.66-2H52v17.83zm0 14.1a4.97 4.97 0 0 1-1.72-.72l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1 0-5.52l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43c.53-.35 1.12-.6 1.72-.72v9.78zM22.15 0h9.78a5 5 0 0 1-.72 3.8l4.44 4.43a3 3 0 1 1-1.42 1.42L29.8 5.2a5 5 0 0 1-5.52 0l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1-.72-3.8zm0 52c.13-.6.37-1.19.72-1.72l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43a5 5 0 0 1 5.52 0l4.43-4.43a3 3 0 1 1 1.42 1.41l-4.44 4.43c.36.53.6 1.12.72 1.72h-9.78zm9.75-24a5 5 0 0 1-3.9 3.9v6.27a3 3 0 1 1-2 0V31.9a5 5 0 0 1-3.9-3.9h-6.27a3 3 0 1 1 0-2h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 1 1 2 0v6.27a5 5 0 0 1 3.9 3.9h6.27a3 3 0 1 1 0 2H31.9z'%3E%3C/path%3E%3C/svg%3E");
        }
    }

    .flip-card-back {
        background-color: #bbb;
        transform: rotateY(180deg);
        background-size: cover;
    }

    .flip-card-front > div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: black;
    }
</style>