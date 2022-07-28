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
        top: 100%;
        width: 100%;
        font-family: 'Poppins', sans-serif;
        text-align: center;
        font-size: clamp(17px, 3vmin, 24px);
        padding: 2vh 0 0 0;
    }
</style>