<template>
  <button :class="CSS">
    <slot name="icon-left"></slot>
    <span class="libelle" :class="textAlign">
        <slot />
    </span>
    <slot name="icon-right"></slot>
  </button>
</template>

<script>
    const acceptedValues = ['left', 'right'];
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
        fontSize: {
            type: String,
            required: false,
            default: 'initial'
        },
        textAlignLeft: {
            type: Boolean,
            required: false 
        },
        textAlignRight: {
            type: Boolean,
            required: false 
        },
        hoverBgSlide: {
            type: Object,
            required: false,
            default: () => { return { from: "left", color: "unset" } },
            validator(value) {
                let msgError = "";
                if('from' in value) { console.log("validator hoverBgSlide - if", value)
                    if (!acceptedValues.includes(value.from)) { console.log("validator hoverBgSlide - if - if", value)
                        msgError = `La propriété 'from' de la prop 'hover-bg-slide' doit être égale à l'une des valeurs suivantes : ${acceptedValues.join(', ')}. Valeur reçue : ${value.from}`;
                    }
                }
                if('color' in value) {
                    if(!(typeof value.color === 'string' && value.color.trim() !== '')) {
                        msgError += `\nLa propriété 'color' de la prop 'hover-bg-slide' doit être une chaîne de caractères non vide. Valeur reçue : ${value.color}`;
                    }
                } else {
                    msgError += `Il manque la propriété 'color' dans la prop 'hover-bg-slide' passée : ${JSON.stringify(value)}`;
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
        if(typeof props.hoverBgSlide !== 'undefined' && 'from' in props.hoverBgSlide && acceptedValues.includes(props.hoverBgSlide.from)) classes += `hover-from-${props.hoverBgSlide.from} `
        return classes
    })

    const textAlign = computed(() => {
        let classes = "";
        if(props.textAlignLeft) classes = "text-align-left "
        if(props.textAlignRight) classes = "text-align-right "
        return classes
    })
</script>

<style scoped>
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

            &.text-align-left {
                text-align: left;
            }
            &.text-align-right {
                text-align: right;
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
            background-color: v-bind('props.hoverBgSlide.color');
            transition: left 0.3s ease-in-out;
        }
        &.hover-from-right:after {
            left: 100%;
        }
        &:hover:after {
            left: 0;
        }
    }
</style>