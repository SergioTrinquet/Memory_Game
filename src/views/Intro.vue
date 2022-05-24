<template>
  <div class="content">
    <div class="txtIntro">Bienvenue dans le jeu<br />du Memory !</div>
    <button @click="goToSettings">Commencez</button>
  </div>
</template>

<script setup>
    /* import { onMounted } from 'vue'  
    import anime from 'animejs/lib/anime.es.js';
*/

    import { useRouter } from 'vue-router'

    const router = useRouter();

    function goToSettings() {
        router.push({ name: 'parametres' }) // Redirection vers page 'Settings'
    }

    /* onMounted(() => {
        anime({
            targets: '.txtIntro',
            translateX: 500,
            duration: 3000
        })
    }) */
</script>

<style scoped>
.content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 5vmin;
}
.txtIntro {
    font-size: 6vmin;
    text-align: center;

    /* font-family: 'Abril Fatface', cursive;
    font-family: 'Caveat Brush', cursive;
    font-family: 'DM Serif Display', serif; */
    font-family: 'Yeseva One', cursive;
}
button {
    cursor: pointer;
    background-color: rgb(241, 237, 0);
    border-radius: 5px;
    border-width: 0;
    padding: 10px 2vw;
    font-size: 4vmin;
    font-weight: bold;
    margin-top: 3vh;
}
</style>