<template>
    <DialogMenu 
        :open="openDialog" 
        @dialog-menu-confirm-quit="onDialogMenuConfirmQuit"
        @dialog-menu-cancel-quit="onDialogMenuCancelQuit"
    />
    <teleport to="body">
        <div id="menu" :class="{ 'display': props.display }">
            <font-awesome-icon 
                icon="xmark" 
                id="close-menu" 
                @click="$emit('close')"
            />
            <BaseButton 
                @click="goToAccueil"
                :variant="BUTTON_VARIANTS.MENU"
                rounded
            >
                Accueil
            </BaseButton>
            
            <slot :check-if-game-started-and-execute="checkAndExecute"></slot>
        </div>
    </teleport>
</template>

<script setup>
    import BaseButton from '@/components/base/BaseButton.vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'
    import { ref, defineProps, defineEmits, defineAsyncComponent } from 'vue'
    import { BUTTON_VARIANTS } from '@/constants/settings.js'
    
    const store = useStore();
    const router = useRouter();

    const DialogMenu =  defineAsyncComponent(() => import(/* webpackChunkName: "DialogMenu" */ '@/components/DialogMenu.vue'))

    const props = defineProps({
        display: {
            type: Boolean,
            default: false
        }
    });

    const emit = defineEmits(['close']);

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
        emit('close');
        store.commit('SET_TURNS', 0);
    }

    function onDialogMenuCancelQuit() {
        pendingAction.value = null;
        openDialog.value = false;
        emit('close');
    }
</script>

<style scoped>
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
#close-menu {
    cursor: pointer;
    font-size: clamp(35px, 3vw, 45px);
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
