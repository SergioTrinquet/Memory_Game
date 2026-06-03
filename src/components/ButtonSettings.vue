<template>
    <BaseButton 
        v-if="isFromMenuChangeParameter && direction === BUTTON_DIRECTION.BACKWARD" 
        :variant="BUTTON_VARIANTS.CANCEL"
    >
    <!-- <BaseButton 
        v-if="isFromMenuChangeParameter && direction === BUTTON_DIRECTION.BACKWARD" 
        :outline="'var(--color-primary)'"
        :hover-bg-slide="{from: BUTTON_HOVER_BG_SIDE.RIGHT, bgcolor: 'var(--color-primary)', color: '#fff'}"
    > -->
        <font-awesome-icon icon="fa-arrow-rotate-left" />
        <span>annuler</span>
    </BaseButton>

    <BaseButton 
        v-else-if="isFromMenuChangeParameter && direction === BUTTON_DIRECTION.FORWARD" 
        :variant="BUTTON_VARIANTS.VALIDATE"
    >
        <span>valider</span>
        <font-awesome-icon icon="fa-check" />
    </BaseButton>


    <BaseButton 
        v-else-if="!isFromMenuChangeParameter && direction === BUTTON_DIRECTION.BACKWARD"
        :variant="BUTTON_VARIANTS.SETTINGS_PREV"
    >
        précédent
    </BaseButton>

    <BaseButton 
        v-else-if="!isFromMenuChangeParameter && direction === BUTTON_DIRECTION.FORWARD"
        :variant="BUTTON_VARIANTS.SETTINGS_NEXT"
        :style="labelCentered ? { textAlign: 'center' } : {}"
    >
        suivant
    </BaseButton>
</template>

<script setup>
    import BaseButton from '@/components/base/BaseButton.vue'
    import { BUTTON_DIRECTION, BUTTON_VARIANTS/*, BUTTON_HOVER_BG_SIDE*/ } from '@/constants/settings.js'

    const { direction, isFromMenuChangeParameter, labelCentered } = defineProps({
        direction: { 
            type: String, 
            required: true, 
            default: "BUTTON_DIRECTION.FORWARD",
            validator(value) {
                const acceptedValues = Object.values(BUTTON_DIRECTION);
                 if (!acceptedValues.includes(value)) {
                    console.error(`La prop 'direction' du composant ButtonSettings doit être égale à l'une des valeurs suivantes : ${acceptedValues.join(', ')}. Valeur reçue : ${value}`);
                    return false;
                }
            } 
        },
        isFromMenuChangeParameter: {
            type: Boolean,
            required: true,
            default: false
        },
        labelCentered: {
            type: Boolean,
            required: false,
            default: false
        }
    });
</script>

<style scoped>
    button {
        height: max(6vh, 34px);
        width: max(160px, 50%);
        font-size: clamp(20px, 3.3vmin, 28px);
    }
</style>
