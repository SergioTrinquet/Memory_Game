<template>
  <div class="nb-tours">
      {{ nbPlayedTurns }}: {{ prop.nbTurns }}
    </div>
</template>

<script setup>
    import { computed, defineProps } from 'vue'

    const prop = defineProps({ nbTurns: Number })
    
    const nbPlayedTurns = computed(() => {
        const pluriel = (prop.nbTurns > 1) ? "s" : ""
        return `Tour${pluriel} joué${pluriel}`
    })
</script>

<style>
    .nb-tours {
        font-size: clamp(17px, 3vmin, 24px);
        line-height: 2.5vh;
        width: clamp(45px, 10vw, 130px);
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: var(--color-3);
        padding: 1vw;
        /* margin: calc(var(--margin-header) * -1) 0 0 0; */

        position: absolute;
        top: 0;
        right: var(--margin-header);
        height: 10vh;
    }
</style>