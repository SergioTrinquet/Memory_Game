<template>
  <div class="container">
        <div class="badPath">
            <font-awesome-icon icon="exclamation-circle" class="icon" />
            <p>Oups! La page que vous voulez afficher
            <br>  
            n'existe pas.</p>
        </div>
        <router-link to="/">
           <button>Retour à la page d'accueil</button>
        </router-link>
    </div>
</template>

<style scoped>
.container {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
}
.badPath {
    margin: 0 5vw;
}
.badPath p {
    font-family: 'Yeseva One', cursive;
    margin: 0 0 4vh 0;
}
button {
    background-color: rgb(241, 237, 0);
    border-radius: 5px;
    border-width: 0;
    padding: 10px 2vw;
    font-size: 3.5vmin;
    font-weight: bold;
    margin-top: 3vh;
}
.icon {
    font-size: 6vmin;
    margin: 0 0 1.5vh 0;
}
</style>