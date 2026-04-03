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
        font-family: 'Fredoka', sans serif;
        font-size: clamp(19px, 3.3vmin, 26px);
        text-align: center;
        padding: 2vh 0 0 0;
    }
</style>