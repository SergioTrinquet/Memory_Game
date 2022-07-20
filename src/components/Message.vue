<template>
    <div 
        class="message"
        :class="{ display: localMsg.length > 0 }"
        @click="clearMsg"
    >
        <div class="content-message" v-html="localMsg"></div>
    </div>
</template>


<script setup>
    import { useStore } from 'vuex'
    import { defineProps, ref, watch } from 'vue'
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

    let localMsg = ref("");

    watch( 
        () => props.content, 
        (val) => {
            //console.log("watch sur 'props.content'", JSON.stringify(val)); //TEST
            queueMessages(val)

            //TEST_queueMessages(val) // V2 : 05/07/2022
        }
    )


    /// V2 : Fonctionne ///
    /* function TEST_queueMessages(val) {
        let arr = [];
        arr.push(val)
        arr.reduce( async (previousPromise, nextID) => {  console.log(nextID)
            await previousPromise
            return displayMessage(nextID);
        }, Promise.resolve())
    } */
    ///// Fin V2 /////

    
    // Pour chainer les messages sans que le dernier appelé ne s'affiche avant la fin du précédent
    let resolved = null;
    let P = null;
    async function queueMessages(val) {
        if(resolved !== null) {
            await P;
            console.log("La promesse précédente est terminée...."); // TEST
        }
        resolved = "pending"
        resolved = await displayMessage(val)
        if(resolved == 'resolved') resolved = null
    }
    

    let tl;///
    async function displayMessage(val) {
        //console.log("VALEUR DE VAL =>", val); //TEST
        P = new Promise(resolve => { ////

            // Anime.js
            //let tl = anime.timeline({
             tl = anime.timeline({
                targets: '.content-message',
                begin: (anim) => console.log("Animation commencée", anim.began), // TEST
                complete: (anim) => { 
                    console.log("Animation terminée", anim.completed); // TEST
                    resolve('resolved'); // Fin de la promesse 
                }                        
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
                    //console.table("animations", animationMsg.animations); //TEST

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
                        console.log("Animation finished !!!"); //TEST
                        localMsg.value = "";
                        document.querySelector('.content-message').removeAttribute('style');
                    })
                } /* else {
                    throw "Libellé d'animation de texte pas présente"
                } */
            })



        }); ////
        return P; ////

    }

    // Appelé qd click sur fond message pour le faire disparaitre
    function clearMsg() { 
        localMsg.value = ""; 
        // On va directement à la fin de l'animation en cours, ce qui entraine la fin de la promesse :'resolve' appelé dès la fin de l'anim. que l'on vient d'écourter
        // Cela permet de passer au message suivant s'il y en a un, sans attendre la fin de la promesse
        tl.seek(tl.duration); 
    }
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
.message > .content-message {
    color: #fff;
    font-family: 'Yeseva One', cursive;
    font-size: clamp(20px, 8vmin, 100px);
    text-shadow: 0 5px 30px rgba(0,0,0,0.4);
    text-align: center;
    max-width: 90vw;
}
</style>