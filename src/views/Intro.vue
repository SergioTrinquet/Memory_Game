<template>
    <div class="content">
        <div class="carre"></div>
        <div class="contentTxt">
            <div class="txtIntro">Bienvenue dans le jeu<br />du Memory !</div>
            <button @click="goToSettings">
                <span class="libelle">Commencez</span>
                <span class="bg"></span>
            </button>
        </div>
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
.carre {
    position: fixed;
    z-index: 1;
    opacity: 0.4;
    background-color: #fff;
    width: 40vmin;
    aspect-ratio: 1 / 1;
    transform: rotate(45deg);
    animation:  4s ease infinite squareRotation;
}
@keyframes squareRotation {
    80% { transform: rotate(45deg); }
    100% { transform: rotate(135deg); }
}
.contentTxt {
    position: absolute;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 30vmin;
}
.txtIntro {
    font-size: 7vmin;
    text-align: center;
    /* font-family: 'Abril Fatface', cursive;
    font-family: 'Caveat Brush', cursive;
    font-family: 'DM Serif Display', serif; */
    font-family: 'Yeseva One', cursive;
    text-shadow: 0 3px 0px rgba(0,0,0,0.4)
}
button {
    cursor: pointer;
    background-color: rgb(241, 237, 0);
    color: #000;
    border-radius: 5px;
    border-width: 0;
    padding: 2vmin 2vmin;
    position: relative;
    overflow: hidden;
    display: flex; 
    align-items: center; 
    justify-content: center;
    width: 70%;
    transition: color 0.3s ease-in-out;
}
button > span.libelle { 
    /* position: absolute; */ 
    z-index:2;
    font-size: 4vmin;
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
}
button:hover > span.bg {
    left: 0%;
}
</style>