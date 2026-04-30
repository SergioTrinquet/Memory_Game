<template>
  <div class="container">
        <div class="bad-path">
            <font-awesome-icon icon="exclamation-circle" class="icon" />
            <p>Oups! La page que vous voulez afficher
            <br>  
            n'existe pas.</p>
        </div>
        <router-link to="/">
            <BaseButton 
                rounded
                variant="action"
            >
                Retour à la page d'accueil
            </BaseButton>
        </router-link>
    </div>
</template>

<script setup>
    import BaseButton from '@/components/base/BaseButton.vue'
</script>

<style scoped>
.container {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
}
.bad-path {
    margin: 0 5vw;
}
.bad-path p {
    font-family: 'Yeseva One', cursive;
    margin: 0 0 4vh 0;
}
a {
    text-decoration: none;
}   
button {
    margin-top: 3vh;
    font-size: 3vmin;
    padding-inline: 5vmin;
}
.icon {
    font-size: 6vmin;
    margin: 0 0 1.5vh 0;
}
</style>