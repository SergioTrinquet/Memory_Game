<template>
    <router-view/>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
/* @import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Bubblegum+Sans&family=Caveat+Brush&family=Concert+One&family=DM+Serif+Display&family=Dancing+Script:wght@600;700&family=Fredericka+the+Great&family=Grand+Hotel&family=Oleo+Script&family=Pacifico&family=Sniglet:wght@400;800&family=Yeseva+One&display=swap');
 */
@import url('https://fonts.googleapis.com/css2?family=Grand+Hotel&family=Poppins:wght@100;200;300;400;500;600&family=Yeseva+One&display=swap');

:root {
  --color-primary-light: #ab00ef67;
  --color-primary: #AC00EF;
  --color-primary-dark-1: #8800BD;
  --color-primary-dark-2: #64008B;
  --color-primary-dark-3: #44005f;
  --margin-header: 14px;
  --color-tertiary: #00b4e0;
  --color-tertiary-dark: #028eb1;
  --color-error: red;
  --width-icons-menu: clamp(35px, 3vw, 45px);
  --width-nb-tours: clamp(45px, 10vw, 130px);
  --space-bottom-bt-change-disposition: 3vh;
  --topPositionElPgIntro: -56vmin;
  --padding-modal-settings: 3vh;
}

* {
    box-sizing: border-box;
    /* font-family: 'Grand Hotel', cursive; */
    font-family: 'Yeseva One', cursive;
    /* font-family: 'Pacifico', cursive; */
    font-size: clamp(16px, 4vmin, 28px);
}
body {
  background: rgb(100,0,139);
  background: linear-gradient(0deg, rgba(100,0,139,1) 16%, rgba(184,0,255,1) 100%); 
  color: #fff;
  margin: 0;
  padding: 0;
}

/* V1 - Fonctionne !! */
html, body {
  height: 100%;
  overflow: hidden; /* Empeche de reloader qd pull vers le bas sur mobile */ 
}
/* FIN */

/* V2 - Fonctionne !! */
/* html, body {
  height: 100%; 
}
html {
  overflow: hidden;
}
body { 
  width: 100%;
  position: fixed;
  -webkit-overflow-scrolling: touch;
  /* border: 0; outline: 0; overflow: hidden; */ /*
} */
/* FIN V2 */

#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;*/
  height: 100%;
}

button, 
button > span {
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
}

input, 
select, 
option,
.msg-error {
  font-family: 'Poppins', sans-serif; 
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
}
input[type="text"]:focus, 
select:focus {
  outline: 3px solid #dd98f9;
}

</style>
