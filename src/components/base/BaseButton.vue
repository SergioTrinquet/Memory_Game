<template>
  <button class="bt" :class="CSS">
      <span class="libelle">
          <slot />
      </span>
      <span class="bg"></span>
  </button>
</template>

<script setup>
    import { defineProps, computed } from 'vue'

    const props = defineProps({
        outline: {
            type: String,
            required: false
        },
        hover: {
            type:  Object,
            required: false,
            validator(value) {
                const val = Object.prototype.toString.call(value);
                if(val === '[object Object]') { // Si objet...
                    if(!('color' in value) && !('backgroundColor' in value)) {
                        console.error("Il n'y a ni la propriété 'color' ni la propriété 'backgroundColor' dans la prop passée !!", value)
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
            required: false 
        }
    })

    const CSS = computed(() => {
        let classes = "";
        if(props.outline) classes += "outline "
        if(props.hover) classes += "hover "
        if(props.rounded) classes += "rounded "
        return classes
    })

    const CSSoutline = computed(() => (typeof props.outline == 'undefined') ? "unset" : props.outline)
    const CSSfontSize = computed(() => (typeof props.fontSize == 'undefined') ? "initial" : props.fontSize)
    const CSShover = computed(() => (typeof props.hover == 'undefined') ? { color: "unset", backgroundColor: "unset" } : props.hover)
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
        border-color: v-bind('CSSoutline');
        color: v-bind('CSSoutline');
        background-color: transparent;
    }
    button.bt.rounded {
        border-radius: 100vh;
    }
    button > .libelle { 
        /* position: absolute; */ 
        z-index:2;
        font-size: v-bind('CSSfontSize');
    }
    button.bt > .bg {
        content: "";
        width: 100%;
        height: 100%;
        background-color: v-bind('CSShover.backgroundColor');
        top: 0;
        left: -100%;
        position: absolute;
        z-index: 0;
        transition: left 0.3s ease-in-out;
    }
    button.bt.hover:hover {
        color: v-bind('CSShover.color');
    }
    button.bt.hover:hover > .bg {
        left: 0%;
    }
</style>