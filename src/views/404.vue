<template>
  <div class="container">
        <div class="bad-path">
            <font-awesome-icon icon="exclamation-circle" class="icon" />
            <p>Oups! La page que vous voulez afficher n'existe pas.</p>
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
    margin: auto;
    width: 60%;
    @media (max-width: 600px) {
        width: 80%;
    }
}
.bad-path p {
    font-family: 'Yeseva One', cursive;
    margin: 0 0 4vh 0;
    text-wrap: balance;
    text-shadow: 0 5px 2px rgba(0,0,0,0.4);
    line-height: clamp(20px, 5.2vmin, 36px);
}
a {
    text-decoration: none;
}   
button {
    margin-top: 3vh;
    font-size: max(16px, 3vmin);
    padding-inline: 6vmin;
}
.icon {
    font-size: max(28px, 6vmin);
    margin: 0 0 1.5vh 0;
}
</style>