<template>
    <div class="msg-countdown">
        Plus que <span class="countdown">{{ countdown }}</span> sec. pour choisir ta 2eme carte
    </div>
</template>

<script setup>
    import { ref, computed, defineEmits, onMounted, onUnmounted} from 'vue'
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
    .msg-countdown {
        color: #fff;
        width: 80vw;
        text-align: center;
        font-size: clamp(16px, 3.3vmin, 23px);
        line-height: clamp(18px, 3.6vmin, 23px);
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
    }
    .countdown {
        font-family: inherit;
        font-weight: 800;
        margin: 0 1vw;
        text-shadow: 2px 3px rgb(111, 0, 153);
        transform: scale(1.2);
    }
</style>