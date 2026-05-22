<template>
    <div class="header">
        <div class="wrapper-icon-menu">
            <div @click="openMenu" >
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

    <!-- Le Menu est maintenant intégré ici -->
    <Menu 
        :display="internalDisplay" 
        @close="closeMenu"
    >
        <!-- On relaie le contenu personnalisé du Header vers le Menu -->
        <template #default="slotProps">
            <slot name="menu-content" v-bind="slotProps" />
        </template>
    </Menu>
</template>

<script setup>
    import { ref, useSlots, defineEmits, defineProps, watch, defineAsyncComponent } from 'vue'
    
    const Menu = defineAsyncComponent(() => import(/* webpackChunkName: "Menu" */ '@/components/Menu.vue'))

    const slots = useSlots()
    const props = defineProps({
        display: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits(['update:display', 'close-menu'])

    // État interne pour gérer l'ouverture/fermeture localement
    const internalDisplay = ref(false)

    // On synchronise l'état interne avec la prop (utile pour Game.vue en fin de partie)
    watch(() => props.display, (val) => {
        internalDisplay.value = val
    }, { immediate: true })

    function openMenu() {
        internalDisplay.value = true
        emit('update:display', true)
    }

    function closeMenu() {
        internalDisplay.value = false
        emit('update:display', false)
        emit('close-menu')
    }
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
    z-index: 1; /* Pour être sûr qu'il soit au dessus du reste mais sous le menu (z-index 2) */
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

#icon-menu {
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
</style>
