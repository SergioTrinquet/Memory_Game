<template>
  <div class="countdown">
    {{ countdown }}
</div>
</template>

<script setup>
    import { ref, computed, defineEmits/* , defineProps, watch */ , onMounted, onUnmounted} from 'vue'
    import { useStore } from 'vuex'

    const store = useStore()
    const timeDisplayCard = computed(() => store.state.time_display_card)
    const countdown = ref(timeDisplayCard.value)

    const emit = defineEmits(['countdownOver'])

    /* const props = defineProps({ 
            abort: Boolean 
        })
    watch(
        () => props.abort, 
        (val) => { 
            //console.log("Watch dans composant 'Countdown'", "start >> " + val.start, "abort >> " + val.abort) //TEST
            console.log("Watch sur 'prop.abort' ds composant 'Countdown'", val) //TEST
            if(val.abort) {
                display.value = false
                stopCountdown()
            }
        }
    ) */


    let ct = null;
    const startCountdown = () => { ct = setInterval(decrease, 1000) };
    const stopCountdown = () => clearInterval(ct);

    function decrease() {
        //console.log("Appelé ttes les sec."); //TEST
        if(countdown.value > 0) {
            countdown.value -= 1
        } else {
            stopCountdown();
            emit('countdownOver'); // envoi info ds composant parent comme quoi décompte est terminé
        }
    }


    onMounted(() => startCountdown())
    onUnmounted(() => stopCountdown())
</script>

<style>
    .countdown {
        position: fixed;
        top: 100px;
        color: #fff;
        font-weight: bold;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>