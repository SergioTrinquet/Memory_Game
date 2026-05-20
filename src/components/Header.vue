<template>
     <DialogMenu 
        :open="openDialog" 
        @dialog-menu-confirm-quit="onDialogMenuConfirmQuit"
        @dialog-menu-cancel-quit="onDialogMenuCancelQuit"
     />
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
                    :variant="BUTTON_VARIANTS.MENU"
                    rounded
                >
                    Accueil
                </BaseButton>
                
                <slot name="btn-rejouer" :check-if-game-started-and-execute="checkAndExecute"></slot>

                <slot name="select-change-parametres" :check-if-game-started-and-execute="checkAndExecute"></slot>
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
        <div class="content" v-if="slots.default">
            <slot />
        </div>
    </div>
</template>

<script setup>
    import BaseButton from '@/components/base/BaseButton.vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'
    import { ref, defineProps, defineEmits, watch, useSlots, defineAsyncComponent } from 'vue'
    import { BUTTON_VARIANTS } from '@/constants/settings.js'
    
    const store = useStore();
    const router = useRouter();
    const slots = useSlots() // pour savoir si slot existe ou pas

    const DialogMenu =  defineAsyncComponent(() => import(/* webpackChunkName: "DialogMenu" */ '@/components/DialogMenu.vue'))

    const display = ref(false);
    const openDialog = ref(false);
    const pendingAction = ref(null);

    // Redirection vers la page d'accueil q click sur bt 'Accueil'
    function goToAccueil() {
        checkAndExecute(() => {
            router.push({ name: 'introduction' });
        })
    }

    function checkAndExecute(action) {
        if(store.state.turns_played > 0) {
            pendingAction.value = action;
            openDialog.value = true;
        } else {
            action();
        }
    }

    function onDialogMenuConfirmQuit() {
        if(pendingAction.value) {
            pendingAction.value();
            pendingAction.value = null;
        }
        openDialog.value = false;
        display.value = false;
        store.commit('SET_TURNS', 0); // Réinitialisation du nb de tours joués dans le store pour signifier que la partie est terminée et ainsi éviter que le dialog ne s'affiche à nouveau si l'utilisateur retourne au menu
    }
    function onDialogMenuCancelQuit() {
        pendingAction.value = null;
        openDialog.value = false;
        display.value = false;
    }

    function toggleMenu() {
        display.value = !display.value;
    }

    // Gestion affichage ou non du menu
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
</script>

<style scoped>
.header {
    --margin-header: 14px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    padding: var(--margin-header) var(--margin-header) 0 var(--margin-header);
    display: flex;
    gap: clamp(3px, 3vw, 10px);
}
.content {
    flex-grow: 1;   
    min-width: 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
}

@media screen and (min-aspect-ratio: 2 / 1) and (max-height: 600px) {
    .content {
        flex-direction: column;
        align-items: center;
        position: fixed;
        background-color: rgba(0,0,0,0.3);
        top: 0;
        right: 0;
        height: 100%;
        margin: 0;
        width: clamp(180px, 20vw, 300px);
        justify-content: center;
    }
}

#menu {
    position: fixed;
    z-index: 2;
    top: -100%;
    height: 100%;
    width: 100vw;
    background-color: rgba(255,255,255,0.95);
    color: var(--color-primary);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: top 0.3s ease-in-out;
    &.display {
        top: 0;
    }
}
:deep(button) {
    font-size: clamp(18px, 3.5vw, 26px);
    font-weight: 500;
    margin: 2vh 0;
    width: min(70%, 700px);
    line-height: clamp(19px, 4.3vw, 26px);
    padding: 3vmin 3vmin;
}
#icon-menu,
#close-menu {
    cursor: pointer;
    font-size: clamp(35px, 3vw, 45px);
}
.wrapper-icon-menu > div {
    display: flex;
    flex-direction: column;
    position: relative;

    &::after {
        content: "MENU";
        font-weight: bold;
        font-size: clamp(15px, 1.2vw, 18px);
        position: absolute;
        text-align: center;
        width: 100%;
        font-family: monospace;
        transform: translateY(15px);
        opacity: 0;
        transition: all 0.3s ease;
    }
}
.wrapper-icon-menu:hover > div::after {
    opacity: 1;
    transform: translateY(clamp(35px, 5vmax, 45px));
}
#close-menu {
    position: absolute;
    top: 3vh;
    left: 3vh;
    transition: transform 0.3s ease-in-out;
    &::before {
        content: "Fermer";
        position: absolute;

    }
    &:hover {
        transform: rotate(180deg);
    }
}
</style>