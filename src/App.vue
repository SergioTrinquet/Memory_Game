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
@import url('https://fonts.googleapis.com/css2?family=Grand+Hotel&family=Yeseva+One&display=swap');

:root {
  --bg-menu: #AC00EF;
  --margin-header: 14px;
  --color-3: #00b4e0;
  --color-error: red;
  --width-icons-menu: clamp(35px, 3vw, 45px);
  --width-nb-tours: clamp(45px, 10vw, 130px);
  --space-bottom-bt-change-disposition: 3vh;
}

* {
    box-sizing: border-box;
    font-family: 'Grand Hotel', cursive;
    /* font-family: 'Pacifico', cursive; */
    font-size: clamp(20px, 4vmin, 30px);
}
body {
  background: rgb(100,0,139);
  background: linear-gradient(0deg, rgba(100,0,139,1) 16%, rgba(184,0,255,1) 100%); 
  color: #fff;
  margin: 0;
  padding: 0;
}

/* html, body {
  height: 100%;
}
 */
html {
  border: solid 4px rgb(251, 255, 0); 
  height: -webkit-fill-available;
}
body {
  border: solid 2px rgb(255, 0, 0); 
  min-height: 100vh;
  min-height: -webkit-fill-available;
}

#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;*/
  height: 100%;
}

button, 
button > span {
  font-family: 'Yeseva One', cursive;
  font-size: 3vw;
  cursor: pointer;
}

input, 
select, 
option,
.msg-error {
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-size: clamp(12px, 3vw, 17px);
}
input, 
select {
  border: 0;
  background-color: #e9e9e9;
  padding: 8px 15px;
  border-radius: 5px;
}
</style>
