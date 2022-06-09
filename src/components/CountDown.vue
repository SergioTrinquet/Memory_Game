<template>
    <div class="msgCountdown">
        Plus que <span class="countdown">{{ countdown }}</span> sec. pour choisir ta 2eme carte
    </div>
</template>

<script setup>
    import { ref, computed, defineEmits/* , defineProps, watch */ , onMounted, onUnmounted} from 'vue'
    import { useStore } from 'vuex'

    const store = useStore()
    const timeDisplayCard = computed(() => store.state.time_display_card)
    const countdown = ref(timeDisplayCard.value)

    const emit = defineEmits(['countdownOver'])

    let ct = null;
    const startCountdown = () => { ct = setInterval(decrease, 1000) };
    const stopCountdown = () => clearInterval(ct);

    function decrease() {
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
    .msgCountdown {
        position: fixed;
        top: 100px;
        color: #fff;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .countdown {
        font-weight: bold;
        margin: 0 1vw;
    }
</style>