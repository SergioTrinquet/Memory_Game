<template>
    <div 
        class="message"
        :class="{ display: localMsg.length > 0 }"
        @click="clearMsg"
    >
        <div class="contentMessage" v-html="localMsg"></div>
    </div>
</template>


<script setup>
    import { useStore } from 'vuex'
    import { defineProps, ref, computed, watch } from 'vue'
    import anime from 'animejs/lib/anime.es.js';

    const store = useStore()

    const props = defineProps({ 
        content: { 
            type: [Object, Array],
            required: true,
            validator(value) {
                const val = Object.prototype.toString.call(value);
                // Si objet...
                if(val === '[object Object]') {
                    if(!('text' in value && 'animationName' in value)) {
                        console.error("OBJET : Il manque la ou les propriétés 'text' et 'animationName' à la prop passée !!", value)
                        return false
                    } else {
                        return true
                    }
                }
                // Si tableau...
                if(val === '[object Array]') {
                    let ok = true;
                    value.forEach(v => {
                        if(!('text' in v && 'animationName' in v)) {
                            console.error("TABLEAU : Il manque la ou les propriétés 'text' et 'animationName' à la prop passée !!", v)
                            ok = false
                        } 
                    })
                    return ok;
                }
            }
        } 
    })
    const msg = computed(() => props.content)
    let localMsg = ref("");


    watch(msg, (val) => {
        console.log("watch sur 'msg'", JSON.stringify(val)); //TEST
        displayMessage(val)
    })


    function displayMessage(val) {
        console.log("VALEUR DE VAL =>", val); //TEST

        // Anime.js
        let tl = anime.timeline({
            targets: '.contentMessage',
            begin: (anim) => console.log("Animation commencée", anim.began), // TEST
            complete: (anim) => console.log("Animation terminée", anim.completed) // TEST
        });
        tl.restart();

        // Si val n'est pas un tableau, il en devient un
        if(!Array.isArray(val)) {
            val = [val];
        } 

        val.forEach(v => {  
            if(!!v.animationName !== false) { // Si animation présente...
                // On check si l'anim passée existe...
                if(!store.getters.isAnimationNameValid(v.animationName)) {
                    localMsg.value = v.text;
                    console.error("Libellé d'animation de texte invalide !");
                    return
                }

                const animationMsg = store.getters.getMessageAnimationByName(v.animationName);
                console.table("animations", animationMsg.animations); //TEST

                tl
                    .add({
                        duration: 1,
                        begin: (anim) => {
                            console.log("Animation ds la boucle commencée", anim.began); //TEST
                            localMsg.value = v.text;
                        }
                    });

                //TEST
                /* tl.add({ scale: [0, 1], opacity: 1, duration: 300, easing: "easeInQuad" }, "-=300")
                .add({ scale: 4, opacity: 1, duration: 300, easing: "easeOutQuad" })
                .add({ opacity: [1, 0], duration: 200, easing: "easeOutQuad" }); */
                //FIN TEST

                animationMsg.animations.forEach(anim => tl.add(anim) );

                tl.finished.then(() => { 
                    //console.log("Animation finished !!!"); //TEST
                    clearMsg();
                    document.querySelector('.contentMessage').removeAttribute('style');
                })
            } /* else {
                throw "Libellé d'animation de texte pas présente"
            } */
        })

    }


    function clearMsg() { localMsg.value = "" }
</script>

<style scoped>
.message {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
    text-shadow: 0 10px 10px rgba(0,0,0,0.9);
    font-family: 'Yeseva One', cursive;
    display: none;
}
.message.display {
    display: flex;
    justify-content: center;
    align-items: center;
}
.message > .contentMessage {
    color: #fff;
    font-family: 'Yeseva One', cursive;
    font-size: clamp(20px, 8vmin, 100px);
    text-shadow: 0 5px 30px rgba(0,0,0,0.4);
    text-align: center;
    max-width: 90vw;
}
</style>