<template>
    <router-view/>
</template>

<script>
export default {
  name: 'App',
 /*  mounted() {
    this.updateThemeColor();
  },
  methods: {
    updateThemeColor() {
      // On attend un petit tick pour s'assurer que le CSS est bien appliqué
      const rootStyles = getComputedStyle(document.documentElement);
      const color = rootStyles.getPropertyValue('--color-primary-dark-1');
      
      if (color) {
        const metaTag = document.querySelector('meta[name="theme-color"]');
        if (metaTag) {
          metaTag.setAttribute('content', color.trim());
        }
      }
    }
  } */
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Yeseva+One&display=swap');

:root {
  --color-primary: hsl(283, 100%, 47%);
  --color-primary-light: hsl(from var(--color-primary) h s l / 0.4);
  --color-primary-dark-1: hsl(from var(--color-primary) h s calc(l - 10));  /* 37% */
  --color-primary-dark-2: hsl(from var(--color-primary) h s calc(l - 20)); /* 27% */
  --color-primary-dark-3: hsl(from var(--color-primary) h s calc(l - 28)); /* 19% */
  --color-tertiary: hsl(59, 100%, 47%);
  --color-tertiary-light: hsl(from var(--color-tertiary) h s calc(l + 10));
  --color-error: red;
  --padding-modal-settings: 3vh;
}

* {
    box-sizing: border-box;
    margin: 0; 
    padding: 0;
    font-family: 'Yeseva One', cursive;
    font-size: clamp(16px, 4vmin, 28px);
}

html, 
body, 
#app {
  height: 100%;
}
html, body {
  overflow: hidden; /* Empeche de reloader qd pull vers le bas sur mobile */ 
}
body {
  background: center/cover no-repeat url('./assets/imgs/fond.svg'), linear-gradient(0deg, hsl(283, 100%, 40%) 16%, hsl(283, 100%, 40%) 100%);
  color: #fff;
  margin: 0;
  padding: 0;
}

button, 
button > span,
input, 
select, 
option,
.msg-error {
  font-family: 'Fredoka', sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-variation-settings:
    "wdth" 100;
}

button, 
button > span {
  cursor: pointer;
}
button > span { font-weight: unset; }

input, 
select, 
option,
.msg-error {
  text-align: center;
}
option,
.msg-error {
  font-size: clamp(14px, 3vw, 17px);
}
input, 
select {
  font-size:clamp(17px, 3vmin, 20px);
}
input[type="text"], 
select {
  border: 0;
  background-color: #e9e9e9;
  padding: 1vh 2vh;
  border-radius: 4px;
  &:focus {
    outline: 3px solid hsl(from var(--color-primary) h s calc(l + 35));
  }
}

div, span { /* Pour empecher présence curseur avec Edge */
  user-select: none;
}
</style>
