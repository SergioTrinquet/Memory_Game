<template>
  <button class="bt" :class="CSS">
    <slot name="icon-left"></slot>
    <span class="libelle" :class="textAlign">
        <slot />
    </span>
    <slot name="icon-right"></slot>
    <span class="bg"></span>
  </button>
</template>

<script setup>
    import { defineProps, computed } from 'vue'

    const props = defineProps({
        outline: {
            type: String,
            required: false,
            default: "unset"
        },
        hoverEffect: {
            type:  Object,
            required: false,
            default: () => { return { color: "unset", backgroundColor: "unset" } },
            validator(value) {
                const val = Object.prototype.toString.call(value);
                if(val === '[object Object]') { // Si objet...
                    if(!('color' in value) && !('backgroundColor' in value) && !('fromRight' in value)) {
                        console.error("Il n'y a ni la propriété 'color' ni la propriété 'backgroundColor', ni la propriété 'fromRight' dans la prop 'hover-effect' passée !!", value)
                        return false
                    } else if('fromRight' in value && value.fromRight !== true) {
                        console.error("La propriété 'fromRight' de la prop 'hover-effect' n'a pas une valeur conforme. Elle doit être égale à true")
                        return false
                    } else {
                        return true
                    }
                } else { // ...sinon...
                    return false
                }
            }
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
        }
    })

    const CSS = computed(() => {
        let classes = "";
        if(props.outline !== 'unset') classes += "outline "
        if(props.hoverEffect) classes += "hover "
        if(typeof props.hoverEffect !== 'undefined' && 'fromRight' in props.hoverEffect && props.hoverEffect.fromRight === true) classes += "hover-from-right "
        if(props.rounded) classes += "rounded "
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
    button.bt {
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
    }
    button.bt.outline {
        border-width: 4px;
        border-color: v-bind('props.outline');
        color: v-bind('props.outline');
        background-color: transparent;
    }
    button.bt.rounded {
        border-radius: 100vh;
    }
    
    button > .libelle { 
        /* position: absolute; */ 
        z-index:2;
        font-size: v-bind('props.fontSize');
        width: 100%;
    }
    button > .libelle.text-align-left {
        text-align: left;
    }
    button > .libelle.text-align-right {
        text-align: right;
    }
    button.bt > .bg {
        content: "";
        width: 100%;
        height: 100%;
        background-color: v-bind('props.hoverEffect.backgroundColor');
        top: 0;
        left: -100%;
        position: absolute;
        z-index: 0;
        transition: left 0.3s ease-in-out;
    }
    button.bt.hover-from-right > .bg {
        left: 100%;
    }
    button.bt.hover:hover {
        color: v-bind('props.hoverEffect.color');
    }
    button.bt.hover:hover > .bg {
        left: 0%;
    }
</style>