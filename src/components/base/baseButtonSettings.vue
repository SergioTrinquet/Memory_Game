<template>
    <button :class="{ 'reverse': reverse }">
        <font-awesome-icon :icon="icon"></font-awesome-icon>{{ libelle }}
    </button>
</template>

<script setup>
  import { defineProps, computed } from 'vue'

  const props = defineProps({ libelle: String });
  const icon = computed(() => {
      let partialTextAttribut = props.libelle == 'Suivant' ? 'right' 
                              : (props.libelle == 'Précédent' ? 'left' 
                              : '');
      return `circle-arrow-${partialTextAttribut}`
  });
  const reverse = computed(() => props.libelle == 'Précédent' ? true : false);
</script>

<style scoped>
button {
  display: flex;
  align-items: center;
  /* color: #00b4e0; */ color: var(--color-3);
  font-size: clamp(18px, 3.5vw, 26px);
  background-color: transparent;
  border: 0;
  width: 50%;
  transition: all 0.3s ease-in-out;
  margin: auto 1vw;
}
button.reverse {
  flex-direction: row-reverse;
}
button:hover {
  color: #9F00DD;
}
button svg {
  margin: 0 8px 0 0;
  transition: margin 0.3s ease-in-out;
}
button.reverse svg {
  margin: 0 0 0 8px;
}
button:hover svg {
  margin: 0 12px 0 0;
}
button.reverse:hover svg {
  margin: 0 0 0 12px;
}
</style>