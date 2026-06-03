<template>
  <button :class="CSS">
     <font-awesome-icon icon="arrow-left-long" class="icon-left" 
        v-if="props.variant == BUTTON_VARIANTS.SETTINGS_PREV" 
     />
    
    <span class="libelle" :class="textAlign">
        <slot />
    </span>

    <font-awesome-icon icon="arrow-right-long" class="icon-right" 
        v-if="props.variant == BUTTON_VARIANTS.SETTINGS_NEXT" 
    />
  </button>
</template>

<script>
    import { BUTTON_VARIANTS, BUTTON_HOVER_BG_SIDE } from '@/constants/settings.js'
    const acceptedValuesHoverFrom = Object.values(BUTTON_HOVER_BG_SIDE);
    const acceptedValuesVariant = Object.values(BUTTON_VARIANTS);
</script>  
<script setup>
    import { defineProps, computed } from 'vue'

    const props = defineProps({
        outline: {
            type: String,
            required: false,
            default: "unset"
        },
        rounded: {
            type: Boolean,
            required: false 
        },
        variant: {
            type: String,
            required: false,
            validator(value) {
                if(!acceptedValuesVariant.includes(value)) {
                    console.error(`La prop 'variant' du composant BaseButton doit être égale à l'une des valeurs suivantes : ${acceptedValuesVariant.join(', ')}. Valeur reçue : ${value}`);
                    return false;
                }
            }
        },
        fontSize: {
            type: String,
            required: false,
            default: 'initial'
        },
        hoverBgSlide: {
            type: Object,
            required: false,
            default: () => { return {/*  from: "left", color: "unset"  */} },
            validator(value) {
                let msgError = "";
                if('from' in value) {
                    if (!acceptedValuesHoverFrom.includes(value.from)) {
                        msgError = `La propriété 'from' de la prop 'hover-bg-slide' doit être égale à l'une des valeurs suivantes : ${acceptedValuesHoverFrom.join(', ')}. Valeur reçue : ${value.from}`;
                    }
                }
                if('bgcolor' in value) {
                    if(!(typeof value.bgcolor === 'string' && value.bgcolor.trim() !== '')) {
                        msgError += `\nLa propriété 'bgcolor' de la prop 'hover-bg-slide' doit être une chaîne de caractères non vide. Valeur reçue : ${value.bgcolor}`;
                    }
                }
                if('color' in value) {
                    if(!(typeof value.color === 'string' && value.color.trim() !== '')) {
                        msgError += `\nLa propriété 'color' de la prop 'hover-bg-slide' doit être une chaîne de caractères non vide. Valeur reçue : ${value.color}`;
                    }
                }
                if(msgError) {
                    console.error(msgError);
                    return false;
                }
            }
        }
    })

    const CSS = computed(() => {
        let classes = "";
        if(props.outline !== 'unset') classes += "outline "
        if(props.rounded) classes += "rounded "
        if(props.variant && acceptedValuesVariant.includes(props.variant)) classes += `variant-${props.variant} `
        if(typeof props.hoverBgSlide !== 'undefined' && 'from' in props.hoverBgSlide && acceptedValuesHoverFrom.includes(props.hoverBgSlide.from)) classes += `hover-from-${props.hoverBgSlide.from} `
        return classes
    })
</script>

<style lang="scss" scoped>
    button {
        padding: 2vmin 3vmin;
        transition: all 0.3s ease-in-out;
        cursor: pointer;
        border-style: solid;
        border-radius: 5px;
        border-width: 0;
        position: relative;
        overflow: hidden;
        display: flex; 
        align-items: center; 
        justify-content: center;
        &.outline {
            border-width: 4px;
            border-color: v-bind('props.outline');
            color: v-bind('props.outline');
            background-color: transparent;
        }
        &.rounded {
            border-radius: 100vh;
        }

        & > .libelle { 
            z-index: 1;
            font-size: v-bind('props.fontSize');
            width: 100%;
            transition:all 0.3s ease-in-out;
            &:hover {
                color: v-bind('props.hoverBgSlide.color');
            }
        }

        &:after {
            content: "";
            position: absolute;
            z-index: 0;
            width: 100%;
            height: 100%;
            top: 0;
            left: -100%;
            background-color: v-bind('props.hoverBgSlide.bgcolor');
            transition: left 0.3s ease-in-out;
        }
        &.hover-from-right:after {
            left: 100%;
        }
        &:hover:after {
            left: 0;
        }

        @import "../../assets/scss/_variants.module.scss";
        @each $key, $name in $variants {
            &.variant-#{$name} {
                @if $key == "ACTION" {
                    background-color: var(--color-tertiary);
                    color: var(--color-primary-dark-2);
                    font-weight: 500;
                    box-shadow: 0 0.5vmin 1vmin rgba(0,0,0,0.3);
                    white-space: nowrap;

                    &:after {
                        --button-intro-hover-slide: yellow;
                        @supports (color: hsl(from var(--color-tertiary) h s calc(l + 10))) {
                            --button-intro-hover-slide: hsl(from var(--color-tertiary) h s calc(l + 10));
                        }
                        background-color: var(--button-intro-hover-slide);
                    }
                } @else if $key == "MENU" {
                    border: solid 4px var(--color-primary);
                    color: var(--color-primary);
                    background-color: transparent;
                    font-weight: 500;
                    &:hover {
                        color: var(--color-secondary-bt-menu);
                    }
                    &:after {
                        background-color: var(--color-primary);
                    }
                } @else if $key == "SETTINGS_PREV" or $key == "SETTINGS_NEXT" {
                    background-color: var(--color-primary);
                    color: #fff;
                    &:after {
                        background-color: var(--color-primary-dark-1);
                    }

                    @if $key == "SETTINGS_PREV" {
                        text-align: right;
                        &:after {
                            left: 100%;
                        }
                        &:hover:after {
                            left: 0;
                        }
                    } @else if $key == "SETTINGS_NEXT" {
                        text-align: left;
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

                    &:hover {
                        --icon-arrow-move: 1vw;
                        .icon-left {
                            transform: translateX(calc(-1 * var(--icon-arrow-move)));
                        }
                        .icon-right {
                            transform: translateX(var(--icon-arrow-move));
                        }
                    }

                    @media screen and (max-width: 480px) {
                        &:has(.icon-left) .libelle,
                        &:has(.icon-right) .libelle {
                            display: none;
                        }
                    }
                } @else if $key == "VALIDATE" or $key == "CANCEL" {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .libelle > :slotted(svg) {
                        font-size: 0.8em;
                    }

                    @media screen and (max-width: 480px) {
                        .libelle > *:not(svg) {
                            display: none;
                        }
                        .libelle > :slotted(svg) {
                            font-size: 1em;
                        }
                    }

                    @if $key == "VALIDATE" {
                        background-color: var(--color-primary);
                        color: #fff;
                    } @else if $key == "CANCEL" {
                        background-color: transparent;
                        color: var(--color-primary);
                        box-shadow: inset 0 0 0 3px var(--color-primary);
                    }
                }
            }
        }

    } 
</style>