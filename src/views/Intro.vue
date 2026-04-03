<template>
    <div class="content-intro">   

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

        <div class="square first"></div>
        <div class="square last"></div>
        <div class="content-intro-txt">
            <div class="txt-intro">Bienvenue dans le jeu<br />du Memory !</div>
            <BaseButton 
                @click="goToSettings"
                :hover-effect="{ backgroundColor: 'yellow', color: 'var(--color-primary-dark-3)' }" 
                font-size="max(22px, 4vmin)"
                rounded
            >
                Jouer une partie !
            </BaseButton>
            <!-- <BaseButton 
                @click="goToSettings"
                font-size="max(22px, 4vmin)"
                rounded
            >
                Jouer une partie !
            </BaseButton> -->
        </div>
    </div>
</template>

<script setup>
    import BaseButton from '@/components/base/BaseButton.vue'
    import Card from '@/components/Card.vue'
    import { onMounted, ref } from 'vue'  
    import { useRouter } from 'vue-router'

    let i = 0
    const router = useRouter();
    const cardState1 = ref(0)
    const cardState2 = ref(0)
    const idxImgs = [[1, 5], [3, 3], [2, 4], [3, 5], [10, 10], [13, 14]]
    const flattenIdxImgs = idxImgs.flat()
    const idxImgCard1 = ref(1)
    const idxImgCard2 = ref(1)
    const animationScore = ref(false)
    const interval = 5500
    const delayFlipSecondCard = interval / 2.75 //Soit 2000
    const delayFlipBothCards = delayFlipSecondCard * 2

    function goToSettings() {
        router.push({ name: 'parametres' }) // Redirection vers page 'Settings'
    }

    function flipCards() {
        flipFrontCard(idxImgCard1, cardState1) // flip 1ere carte

        // flip 2eme carte après délai...
        setTimeout(() => {
            flipFrontCard(idxImgCard2, cardState2)

            // ...Et on Affiche le point gagné qd les 2 cartes sont identiques
            animationScore.value = false
            if(idxImgCard1.value === idxImgCard2.value) animationScore.value = true
        }, delayFlipSecondCard)

        // flip des 2 cartes en même temps pour cacher le contenu au bout de 4 sec.
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
    })
</script>

<style scoped>
.content-intro {
    --top-position-el-pg-intro: -56vmin;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 5vmin;
    padding: 7vmax 3vmax 3vmax 3vmax;
}

.square {
    position: fixed;
    background-color: #fff;
    aspect-ratio: 1 / 1;
    width: max(150px, 40vmin);
    border-radius: max(10px, 2vmin);
    transform: rotate(45deg);
    &.first {
        z-index: 0;
        opacity: 0.05;
        animation:  4s ease 2s infinite squareRotationInverse;
    }
    &.last {
        z-index: 1;
        opacity: 0.15;
        animation:  4s ease infinite squareRotation;
    }
}
@keyframes squareRotation {
    80% { transform: rotate(45deg); }
    100% { transform: rotate(135deg); }
}
@keyframes squareRotationInverse {
    80% { transform: rotate(45deg); }
    100% { transform: rotate(-45deg); }
}

.content-intro-txt {
    position: absolute;
    z-index: 2;
    margin-top: 7vmin;
}
.txt-intro {
    font-size: max(27px, 7vmin);
    text-align: center;
    font-family: 'Yeseva One', cursive;
    text-shadow: 0 5px 2px rgba(0,0,0,0.4);
}
button {
    background-color: var(--color-tertiary); 
    color: var(--color-primary-dark-2);
    font-weight: 500;
    margin: 6vmin auto 0 auto;
    width: 70%;
    box-shadow: 0 0.5vmin 1vmin rgba(0,0,0,0.3);
    white-space: nowrap;

    /* &:hover {
        background-color: yellow;
        background-color: red;
        color: var(--color-primary-dark-3);
    } */
}
:deep(.libelle) {
    transform: translateY(-2px);
}
.wrapper-card {
    position: absolute;
    z-index: 3;
    width: 12vmin;
    height: 12vmin;
    transform: rotate(-15deg);
    margin: var(--top-position-el-pg-intro) 0 0 -14vmin;
    width: max(60px, 16vmin);
    height: max(60px, 16vmin);
    &.first {
        transform: rotate(-15deg);
    }
    &.last {
        transform: rotate(15deg);
        margin-left: max(60px, 16vmin);
    }
}
:deep(.flip-card-inner) {  
    box-shadow: 0 1vmin 2vmin rgba(0,0,0,0.4); /* SURGHARGE */
}

.score {
    position: absolute;
    margin: var(--top-position-el-pg-intro) 0 0 0;
    z-index: 4;
    font-size: 7vmax;
    color: rgb(61, 61, 61);
    text-shadow: 0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff;
    font-family: 'Fredoka', sans-serif;
    font-weight: 500;
    opacity: 0;
    &.score.anim {
        animation: fadeInUp 1s ease-out 1.5s backwards;
    }
}
@keyframes fadeInUp {
    0% { opacity: 1; transform: scale(0) }
    20% { opacity: 1; transform: scale(1) }
    50% { opacity: 1; }
    100% {
        opacity: 0;
        transform: translateY(-7vh);
    }
}
</style>