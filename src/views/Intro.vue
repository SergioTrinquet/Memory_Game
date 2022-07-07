<template>
    <div class="content">   

        <div class="score" :class="animationScore ? 'anim' : ''">+1</div>
        <div class="wrapper-card first">
            <Card 
                :idxCards="idxImgCard1"  
                :stateCards="cardState1"
            />
        </div>
        <div class="wrapper-card last">
            <Card 
                :idxCards="idxImgCard2"  
                :stateCards="cardState2"
            />
        </div>

        <div class="carre-test"></div><!-- TEST -->
        <div class="carre"></div>
        <div class="content-txt">
            <div class="txt-intro">Bienvenue dans le jeu<br />du Memory !</div>
            <BaseButton 
                @click="goToSettings"
                :hover-effect="{ backgroundColor: 'yellow', color: '#000' }" 
                font-size="max(24px, 4vmin)"
                rounded
            >Commencez</BaseButton>
            <!-- <BaseButton 
                @click="goToSettings"
                :outline="'yellow'" 
                :hover-effect="{ backgroundColor: 'yellow', color: '#AC00EF' }" 
                rounded
            >Commencez</BaseButton> -->
            
        </div>
    </div>
</template>

<script setup>
    import BaseButton from '@/components/base/BaseButton.vue'
    import Card from '@/components/Card.vue'
    import { onMounted, ref } from 'vue'  
    /* import anime from 'animejs/lib/anime.es.js'; */

    import { useRouter } from 'vue-router'

    const router = useRouter();

    function goToSettings() {
        router.push({ name: 'parametres' }) // Redirection vers page 'Settings'
    }

    // Gestion cartes qui tournent
    let i = 0
    const cardState1 = ref(0)
    const cardState2 = ref(0)
    const idxImgs = [[1, 5], [3, 3], [2, 4], [3, 5], [10, 10], [13, 14]] // Indexs pris au hasard des images de fruits
    const flattenIdxImgs = idxImgs.flat()
    const idxImgCard1 = ref(1)
    const idxImgCard2 = ref(1)
    const animationScore = ref(false)
    const interval = 5500
    const delayFlipSecondCard = interval / 2.75 //Soit 2000
    const delayFlipBothCards = delayFlipSecondCard * 2

    function flipCards() {
        // On retourne la 1ere carte (celle de gauche)
        flipFrontCard(idxImgCard1, cardState1)

        // On retourne la 2eme carte (celle de droite) 2 sec. plus tard...
        setTimeout(() => {
            flipFrontCard(idxImgCard2, cardState2)

            // ...Et on Affiche le point gagné qd les 2 cartes sont identiques
            animationScore.value = false
            if(idxImgCard1.value === idxImgCard2.value) animationScore.value = true
        }, delayFlipSecondCard)

        // On retourne les 2 cartes en même temps pour cacher le contenu au bout de 4 sec.
        setTimeout(() => {
            cardState1.value = 0
            cardState2.value = 0
        }, delayFlipBothCards)
    }


    function flipFrontCard(idxImg, card) {
        if(i >= flattenIdxImgs.length) i = 0
        idxImg.value = flattenIdxImgs[i] - 1
        card.value = 1
        i++
    }

    onMounted(() => {
        // Animation cartes
        flipCards()
        setInterval(flipCards, interval)

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
    /* opacity: 0.2; */ opacity: 0.1;
    background-color: #fff;
    width: max(150px, 40vmin);
    aspect-ratio: 1 / 1;
    border-radius: max(10px, 2vmin);
    transform: rotate(45deg);
    animation:  4s ease infinite squareRotation;
}
@keyframes squareRotation {
    80% { transform: rotate(45deg); }
    100% { transform: rotate(135deg); }
}

.carre-test {
    content: "";
    position: fixed;
    z-index: 0;
    opacity: 0.05;
    background-color: #fff;
    width: 40vmin;
    aspect-ratio: 1 / 1;
    border-radius: max(10px, 2vmin);
    transform: rotate(45deg);
    animation:  4s ease 2s infinite squareRotationInverse;
}
@keyframes squareRotationInverse {
    80% { transform: rotate(45deg); }
    100% { transform: rotate(-45deg); }
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
    background-color: rgb(255, 143, 164);
    text-shadow: 0 2px 1px #aa5767;
    color: #fff;
    margin: 6vmin auto 0 auto;
    width: 70%;
    box-shadow: 0 0.5vmin 1vmin rgba(0,0,0,0.3);
    font-weight: bold;
}
button:hover {
    color: #000;
    text-shadow: 0 2px 1px #f1ed00
}

.wrapper-card {
    position: absolute;
    z-index: 3;
    width: 12vmin;
    height: 12vmin;
    transform: rotate(-15deg);
    margin: var(--topPositionElPgIntro) 0 0 -14vmin;
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

:deep(.flip-card-inner) {  
    box-shadow: 0 1vmin 2vmin rgba(0,0,0,0.4); /* SURGHARGE */
}

.score {
    position: absolute;
    margin: var(--topPositionElPgIntro) 0 0 0;
    z-index: 4;
    font-size: 6vmax;
    color: rgb(61, 61, 61);
    text-shadow: 0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff;
    font-family: 'Yeseva One', cursive;
    opacity: 0;
}
.score.anim {
    animation: fadeInUp 1s ease-out 1.5s backwards;
}
@keyframes fadeInUp {
    0% { opacity: 1; transform: scale(0) }
    20% { opacity: 1; transform: scale(1) }
    50% { opacity: 1; }
    100% {
        opacity: 0;
        transform: translateY(-6vh);
    }
}
</style>