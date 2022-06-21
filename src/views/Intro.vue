<template>
    <div class="content">   

        <div class="wrapper-card first" ref="card1">
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front"></div>
                    <div class="flip-card-back"></div>
                </div>
            </div>
        </div>
        <div class="wrapper-card last" ref="card2">
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front"></div>
                    <div class="flip-card-back"></div>
                </div>
            </div>
        </div>

        <!-- <div class="carre-test"></div> --><!-- TEST -->
        <div class="carre"></div>
        <div class="content-txt">
            <div class="txt-intro">Bienvenue dans le jeu<br />du Memory !</div>
            <button @click="goToSettings">
                <span class="libelle">Commencez</span>
                <span class="bg"></span>
            </button>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue'  
    /* import anime from 'animejs/lib/anime.es.js'; */

    import { useRouter } from 'vue-router'

    const router = useRouter();

    function goToSettings() {
        router.push({ name: 'parametres' }) // Redirection vers page 'Settings'
    }

    // Gestion cartes qui tournent
    const card1 = ref()
    const card2 = ref()
    const interval = 4000
    const delay = 2000
    function flipCards(carte1, carte2) {
        let flipCard1 = carte1.value.querySelector('.flip-card');
        let flipCard2 = carte2.value.querySelector('.flip-card');
        let cardBack1 = flipCard1.querySelector('.flip-card-back');
        let cardBack2 = flipCard2.querySelector('.flip-card-back');
        flip(flipCard1, cardBack1)
        setTimeout(flip, delay, flipCard2, cardBack2)
    }

    let i = 0
    const idxImg = [1, 5, 2, 4, 3, 3]
    function flip(flipCard, cardBack) {
        setInterval(() => {
            if(i >= idxImg.length) i = 0
            const idx = idxImg[i]
            if(!flipCard.classList.contains('flipped')) {
                i++
                cardBack.style.backgroundImage = loadImg(idx)
            }
            flipCard.classList.toggle('flipped')
        }, interval)
    }
    // Chargement image carte
    function loadImg(i) {
        const path = require(`@/assets/imgs/fruits/fr_${i}.png`);
        return `url(${path})`;
    } 

    onMounted(() => {
        flipCards(card1, card2) // Animation cartes

        /* anime({
            targets: '.txt-intro',
            translateX: 500,
            duration: 3000
        }) */
    })
</script>

<style scoped>
.content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 5vmin;
    padding: 7vmax 3vmax 3vmax 3vmax;
}
.carre {
    position: fixed;
    z-index: 1;
    opacity: 0.2;
    background-color: #fff;
    width: max(150px, 40vmin);
    aspect-ratio: 1 / 1;
    border-radius: max(10px, 2vmin);
    transform: rotate(45deg);
    animation:  4s ease infinite squareRotation;
}

/* .carre-test {
    content: "";
    position: fixed;
    z-index: 0;
    background-color: rgb(229, 255, 0);
    width: 40vmin;
    aspect-ratio: 1 / 1;
    transform: rotate(5deg);
} */

@keyframes squareRotation {
    80% { transform: rotate(45deg); }
    100% { transform: rotate(135deg); }
}
.content-txt {
    position: absolute;
    z-index: 2;
    margin-top: 7vmin;
}
.txt-intro {
    font-size: max(27px, 7vmin);
    text-align: center;
    /* font-family: 'Abril Fatface', cursive;
    font-family: 'Caveat Brush', cursive;
    font-family: 'DM Serif Display', serif; */
    font-family: 'Yeseva One', cursive;
    text-shadow: 0 5px 2px rgba(0,0,0,0.4);
}
button {
    cursor: pointer;
    background-color: rgb(241, 237, 0);
    color: #000;
    border-radius: 5px;
    border-width: 0;
    padding: 2vmin 2vmin;
    margin: 6vmin auto 0 auto;
    position: relative;
    overflow: hidden;
    display: flex; 
    align-items: center; 
    justify-content: center;
    width: 70%;
    transition: all 0.3s ease-in-out;
}
button > span.libelle { 
    /* position: absolute; */ 
    z-index:2;
    font-size: max(24px, 4vmin);
    font-weight: bold;
}
button > span.bg {
    content: "";
    width: 100%;
    height: 100%;
    background-color: var(--color-3);
    top: 0;
    left: -100%;
    position: absolute;
    z-index: 0;
    opacity: 0.8;
    transition: left 0.3s ease-in-out;
}
button:hover {
    color: #fff;
    text-shadow: 0 2px rgba(0,0,0,0.3);
}
button:hover > span.bg {
    left: 0%;
}


.wrapper-card {
    position: absolute;
    z-index: 3;
    width: 12vmin;
    height: 12vmin;
    transform: rotate(-15deg);
    margin: -56vmin 0 0 -14vmin;
    width: max(60px, 16vmin);
    height: max(60px, 16vmin);
}
.wrapper-card.first {
    transform: rotate(-15deg);
 }
 .wrapper-card.last {
    transform: rotate(15deg);
    margin-left: max(60px, 16vmin);
 }

.flip-card {
  background-color: transparent;
  perspective: 1000px;
  width: 100%;
  padding-top: 100%;
  justify-self: center;
  align-self: center;
  position: relative; /* Vraiment utile ? */
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
    box-shadow: 0 1vmin 2vmin rgba(0,0,0,0.4); /* SURGHARGE */
}
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
  box-shadow: 0 0 0 min(5px, 0.5vmax) #fff inset;
}
@media screen and (max-width: 800px) {
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