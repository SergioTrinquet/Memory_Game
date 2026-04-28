<template>
    <div 
        class="message"
        :class="{ display: localMsg.length > 0 }"
        @click="clearMsg"
    >
        <div :class="contentMsgClassName" v-html="localMsg"></div>
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
                const items = Array.isArray(value) ? value : [value];
                const isValid = items.every(i => i && typeof i === 'object' && 'text' in i && 'animationName' in i);
                if (!isValid) console.error("Format de message invalide : 'text' et 'animationName' sont requis.");
                return isValid;
            }
        }, 
        clear: Boolean
    })
    
    const emit = defineEmits(['onMsgCleared']);
    let localMsg = ref("");
    const contentMsgClassName = 'content-message';
    let tl = null;
    let promiseChain = Promise.resolve(); // Gère la file d'attente des messages

    watch( 
        () => props.content, 
        (val) => {
            //console.log("watch sur 'props.content'", JSON.stringify(val)); //TEST
            promiseChain = promiseChain.then(() => displayMessage(val)); // Pour chainer les messages + anim sans que le dernier appelé ne s'affiche avant la fin du précédent
        }
    )

    watch(
        () => props.clear,
        (val) => {
            if(val) {
                console.log("watch sur 'props.clear'", val); //TEST 
                clearMsg();
                emit('onMsgCleared');
            }
        }
    )
    
    async function displayMessage(val) {
        const messages = Array.isArray(val) ? val : [val];

         // Création d'une nouvelle timeline
        tl = anime.timeline({
            targets: `.${contentMsgClassName}`,
        });

        for (const msg of messages) {
            if (!store.getters.isAnimationNameValid(msg.animationName)) {
                localMsg.value = msg.text;
                console.error(`Animation "${msg.animationName}" inconnue`);        
                continue;
            }

            const animationConfig = store.getters.getMessageAnimationByName(msg.animationName);

            // On change le texte juste avant de lancer sa séquence d'animation    
            tl.add({
                duration: 1,
                begin: () => { localMsg.value = msg.text; }
            });

            // Ajout des étapes d'animation définies dans le store
            animationConfig.animations.forEach(anim => tl.add(anim));
        }

        // On attend que toute la timeline soit terminée
        await tl.finished;

        // Nettoyage final
        localMsg.value = "";
        const el = document.querySelector(`.${contentMsgClassName}`);
        if (el) el.removeAttribute('style');
    }

    // Appelé qd click sur fond message pour le faire disparaitre
    function clearMsg() {
        // promiseChain = Promise.resolve(); // On réinitialise la chaîne
        if (tl) {
            localMsg.value = ""; 
            // On va directement à la fin de l'animation en cours, ce qui entraine la fin de la promesse :'resolve' appelée dès la fin de l'anim. que l'on vient d'écourter
            // Cela permet de passer au message suivant s'il y en a un, sans attendre la fin de la promesse
            tl.seek(tl.duration); 
            /* // On stoppe l'animation en cours
            tl.pause();
            tl = null; */
        }
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

    &.display {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.content-message {
    color: #fff;
    font-family: 'Yeseva One', cursive;
    font-size: clamp(20px, 8vmin, 100px);
    text-shadow: 0 5px 30px rgba(0, 0, 0, 0.4), 2px 2px 0 #000, 3px 3px 0 #000;
    text-align: center;
    max-width: 90vw;
}
:deep(.content-message .icon) {
    font-size: inherit;
    text-shadow: none;
}
</style>