<template>
    <div class="header">
        <teleport to="body">
            <div id="menu" :class="{ 'display': display }">
                <font-awesome-icon 
                    icon="xmark" 
                    id="closeMenu" 
                    @click="toggleMenu"
                />
                <button @click="goToAccueil">Accueil</button>
                <slot name="btn-rejouer"></slot>
            </div>
        </teleport>
        <font-awesome-icon 
            icon="bars"
            id="iconMenu" 
            @click="toggleMenu" 
        />
        <div class="content">
            <slot />
        </div>
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router'
    import { ref, defineProps, defineEmits, watch } from 'vue'

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
}
button,
:slotted(button) {
    border-radius: 50px;
    border: solid 3px var(--bg-menu);
    color: var(--bg-menu);
    background-color: transparent;
    padding: 4px 15px;
    transition: all 0.3s ease-in-out;
    font-size: clamp(18px, 3.5vw, 26px);
}
button:hover {
    background-color: #fff;
    color: var(--bg-menu);
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
#iconMenu,
#closeMenu {
    cursor: pointer;
    font-size: var(--width-icons-menu);
}
#iconMenu {
    top: 20px;
    left: 20px;
    margin-right: var(--margin-header);
}
#closeMenu {
    position: absolute;
    top: 3vh;
    right: 3vh;
    transition: transform 0.3s ease-in-out;
}
#closeMenu::before {
    content: "Fermer";
    position: absolute;

}
#closeMenu:hover {
    transform: rotate(180deg);
}
</style>