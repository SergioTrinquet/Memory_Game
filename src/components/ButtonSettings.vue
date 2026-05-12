<template>
    <!-- V1 -->
    <!-- <BaseButton v-if="direction === BUTTON_DIRECTION.BACKWARD"
        :text-align-right="!isFromMenuChangeParameter"
        v-bind="!isFromMenuChangeParameter ? { 'hover-bg-slide': { color: colorHoverEffect, from: 'right' } } : {}"
    >
        {{ isFromMenuChangeParameter ? "annuler" : "précédent" }}
        <font-awesome-icon icon="fa-arrow-rotate-left" v-if="isFromMenuChangeParameter" class="icon" />
        <template v-if="!isFromMenuChangeParameter" v-slot:icon-left>
            <font-awesome-icon icon="arrow-left-long" class="icon-left" />
        </template>
    </BaseButton>

    <BaseButton v-else
        :text-align-left="!isFromMenuChangeParameter && !labelCentered"
        v-bind="!isFromMenuChangeParameter ? { 'hover-bg-slide': { color: colorHoverEffect } } : {}"
    >
        {{ isFromMenuChangeParameter ? "valider" : "suivant" }}
        <font-awesome-icon icon="fa-check" v-if="isFromMenuChangeParameter" class="icon" />
        <template v-if="!isFromMenuChangeParameter" v-slot:icon-right>
            <font-awesome-icon icon="arrow-right-long"  class="icon-right" />
        </template>
    </BaseButton> -->


    <!-- V2 -->
    <BaseButton v-if="isFromMenuChangeParameter && direction === BUTTON_DIRECTION.BACKWARD">
        annuler
        <font-awesome-icon icon="fa-arrow-rotate-left" class="icon" />
    </BaseButton>
    <BaseButton v-else-if="isFromMenuChangeParameter && direction === BUTTON_DIRECTION.FORWARD">
        valider
        <font-awesome-icon icon="fa-check" class="icon" />
    </BaseButton>

    <BaseButton v-else-if="!isFromMenuChangeParameter && direction === BUTTON_DIRECTION.BACKWARD"
        text-align-right
        :hover-bg-slide="{ color: colorHoverEffect, from: 'right' }"
    >
        précédent
        <template v-slot:icon-left>
            <font-awesome-icon icon="arrow-left-long" class="icon-left" />
        </template>
    </BaseButton>
    <BaseButton v-else-if="!isFromMenuChangeParameter && direction === BUTTON_DIRECTION.FORWARD"
        :text-align-left="!labelCentered"
        :hover-bg-slide="{ color: colorHoverEffect }"
    >
        suivant
        <template v-slot:icon-right>
            <font-awesome-icon icon="arrow-right-long"  class="icon-right" />
        </template>
    </BaseButton>

</template>

<script setup>
    import BaseButton from '@/components/base/BaseButton.vue'
    import { BUTTON_DIRECTION } from '@/constants/settings.js'

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

    const colorHoverEffect = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-dark-1').trim();
</script>

<style scoped>
    .icon {
        position: absolute;
        z-index: 1;
        transform: translateX(1vw);
    }
    .icon-left,
    .icon-right {
        position: absolute;
        z-index: 1;
        transition: transform 0.2s ease;
        --icon-arrow-position: 3vw;
    }
    .icon-left {
        left: var(--icon-arrow-position);
    }
    .icon-right {
        right: var(--icon-arrow-position);
    }

    button {
        background-color: var(--color-primary);
        color: #fff;
        height: max(6vh, 34px);
        width: max(160px, 50%);
        font-size: clamp(20px, 3.3vmin, 28px);

        &:first-child {
            margin: 0 1.5vh 0 0;
        }
        &:last-child {
            margin: 0 0 0  1.5vh;
        }

        &:hover {
            --icon-arrow-move: 1vw;
            .icon-left {
            transform: translateX(calc(-1 * var(--icon-arrow-move)));
            }
            .icon-right {
            transform: translateX(var(--icon-arrow-move));
            }
        }
    }
</style>
