<template>
    <div class="header">
        <teleport to="body">
            <div id="menu" :class="{ 'display': display }">
                <font-awesome-icon 
                    icon="xmark" 
                    id="close-menu" 
                    @click="toggleMenu"
                />
                
                <BaseButton 
                    @click="goToAccueil" 
                    :outline="primaryColor" 
                    :hover-effect="{ backgroundColor: primaryColor, color: '#fff' }" 
                    rounded
                >
                    Accueil
                </BaseButton>
                
                <slot name="btn-rejouer"></slot>
            </div>
        </teleport>
        <div class="wrapper-icon-menu">
            <div @click="toggleMenu" >
                <font-awesome-icon 
                    icon="bars"
                    id="icon-menu" 
                />
            </div>
        </div>
        <div class="content">
            <slot />
        </div>
    </div>
</template>

<script setup>
    import BaseButton from '@/components/base/BaseButton.vue'
    import { useRouter } from 'vue-router'
    import { ref, defineProps, defineEmits, watch } from 'vue'
    import { useStore } from 'vuex'

    const store = useStore()
    const primaryColor = store.getters.getPrimaryColor

    // Redirection vers la page d'accueil q click sur bt 'Accueil'
    const router = useRouter();
    function goToAccueil() {
        router.push({ name: 'introduction' }) 
    }


    // Gestion affichage ou non du menu
    const display = ref(false);
    const props = defineProps({ displayMenu: Boolean }); 
    const emit = defineEmits(['onCloseMenu']);
    
    // Dans 1er argument du 'watch', valeur de la prop passée ds une getter function et non pas directement, sinon erreur.
    // Dans le watch : Affectat° de la valeur de la ref 'display' + emit pour réinitialisation de la prop dans le composant parent
    watch(
        () => props.displayMenu, 
        (val) => {
        display.value = val;
        if(!val) emit('onCloseMenu');
    })
   

    function toggleMenu() {
        display.value = !display.value;
    }
</script>

<style scoped>
.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    padding: var(--margin-header) var(--margin-header) 0 var(--margin-header);
    display: flex;
}
.content {
    flex-grow: 1;
    display: flex;
    margin-right: var(--width-nb-tours);
    /* Largeur encart bleu nb tours - largeur icone menu + ses margin droite et gauche */
    margin-left: calc(var(--width-nb-tours) - (var(--width-icons-menu) + (var(--margin-header) * 2)));
}
button,
:slotted(button) {
    font-size: clamp(18px, 3.5vw, 26px);
    font-weight: bold;
    margin: 2vh 0;
    width: min(70%, 700px);
}

#menu {
    position: fixed;
    z-index: 2;
    top: -100%;
    height: 100%;
    width: 100vw;
    background-color: rgba(255,255,255,0.95);
    color: #7E00B0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: top 0.3s ease-in-out;
}
#menu.display {
    top: 0;
}
#icon-menu,
#close-menu {
    cursor: pointer;
    font-size: var(--width-icons-menu);
}
#icon-menu {
    top: 20px;
    left: 20px;
    margin-right: var(--margin-header);
}
.wrapper-icon-menu > div {
    display: flex;
    flex-direction: column;
}
.wrapper-icon-menu > div::after {
    content: "MENU";
    font-weight: bold;
    font-size: clamp(15px, 1.2vw, 18px);
    position: absolute;
    font-family: monospace;
    transform: translateY(15px);
    opacity: 0;
    transition: all 0.3s ease;
}
.wrapper-icon-menu:hover > div::after {
    opacity: 1;
    transform: translateY(clamp(35px, 5.5vh, 45px));
}
#close-menu {
    position: absolute;
    top: 3vh;
    left: 3vh;
    transition: transform 0.3s ease-in-out;
}
#close-menu::before {
    content: "Fermer";
    position: absolute;

}
#close-menu:hover {
    transform: rotate(180deg);
}
</style>