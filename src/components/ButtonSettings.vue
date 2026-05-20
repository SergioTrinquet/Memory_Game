<template>
    <BaseButton v-if="isFromMenuChangeParameter && direction === BUTTON_DIRECTION.BACKWARD" class="modify-param cancel">
        <font-awesome-icon icon="fa-arrow-rotate-left" class="icon" />
        annuler
    </BaseButton>

    <BaseButton v-else-if="isFromMenuChangeParameter && direction === BUTTON_DIRECTION.FORWARD" class="modify-param validate">
        valider
        <font-awesome-icon icon="fa-check" class="icon" />
    </BaseButton>


    <BaseButton v-else-if="!isFromMenuChangeParameter && direction === BUTTON_DIRECTION.BACKWARD"
        text-align-right
        :variant="BUTTON_VARIANTS.SETTINGS"
        :hover-bg-from="BUTTON_HOVER_BG_SIDE.RIGHT"
    >
        précédent
        <template #icon-left>
            <font-awesome-icon icon="arrow-left-long" class="icon-left" />
        </template>
    </BaseButton>

    <BaseButton v-else-if="!isFromMenuChangeParameter && direction === BUTTON_DIRECTION.FORWARD"
        :text-align-left="!labelCentered"
        :variant="BUTTON_VARIANTS.SETTINGS"
    >
        suivant
        <template #icon-right>
            <font-awesome-icon icon="arrow-right-long"  class="icon-right" />
        </template>
    </BaseButton>
</template>

<script setup>
    import BaseButton from '@/components/base/BaseButton.vue'
    import { BUTTON_DIRECTION, BUTTON_HOVER_BG_SIDE, BUTTON_VARIANTS } from '@/constants/settings.js'

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
    .modify-param {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;

        &.cancel {
            --color-modify-param: hsl(348, 90%, 60%);
        }
        &.validate {
            --color-modify-param: hsl(144, 90%, 30%);
        }
        &.cancel, 
        &.validate {
            /* V. Originale */
            background-color: var(--color-modify-param);
            &:hover {
                background-color: color-mix(in oklab, var(--color-modify-param), hsl(0, 0%, 0%) 10%);
            }

            /* V2 */
            /* box-shadow: inset 0 0 0 2px var(--color-modify-param);
            color: var(--color-modify-param);
            background-color: color-mix(in oklab, var(--color-modify-param), #fff 80%);
            &:hover {
                color:#fff;
                background-color: var(--color-modify-param);
            } */
        }

        .libelle svg {
            font-size: 0.75em;
        }

        &:hover {
            background-color: yellow;
        }
    }

    .icon-left,
    .icon-right {
        position: absolute;
        z-index: 1;
        transition: transform 0.2s ease;
        --icon-arrow-position: 3vw;

        @media screen and (max-width: 480px) {
            position: initial;
            height: 1.4em;
        }
    }
    .icon-left {
        left: var(--icon-arrow-position);
    }
    .icon-right {
        right: var(--icon-arrow-position);
    }

    button {
        height: max(6vh, 34px);
        width: max(160px, 50%);
        font-size: clamp(20px, 3.3vmin, 28px);

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
