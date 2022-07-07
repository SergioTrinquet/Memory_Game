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
        position: absolute;
        top: 0;
        right: var(--margin-header);
        height: 10vh;
        font-size: clamp(17px, 3vmin, 24px);
        line-height: max(18px, 3.3vmin);
        width: var(--width-nb-tours);
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: var(--color-tertiary);
        padding: 1vw;
    }
</style>