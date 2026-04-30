<template>
    <router-view/>
</template>

<script setup>
import { onMounted } from 'vue'

const updateThemeColor = () => {
  // On crée un élément temporaire pour forcer le navigateur à résoudre la couleur
  const temp = document.createElement('div');
  temp.style.color = 'var(--color-primary-dark-1)';
  temp.style.display = 'none';
  document.body.appendChild(temp);
  
  // getComputedStyle renverra la couleur résolue (généralement au format rgb(r, g, b))
  const resolvedColor = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  if (resolvedColor && resolvedColor !== 'rgba(0, 0, 0, 0)') {
    const metaTag = document.querySelector('meta[name="theme-color"]');
    if (metaTag) {
      metaTag.setAttribute('content', resolvedColor);
    }
  }
}

onMounted(() => {
  updateThemeColor();
})
</script>
