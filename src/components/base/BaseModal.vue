<template>
    <div class="modal" :class="propShow">
        <slot />
    </div>
</template>

<script setup>
    import { defineProps } from 'vue'
    let propShow = defineProps({ show: Boolean });
</script>

<style scoped>
    .modal {
        background-color: #fff;
        border-radius: 4px;
        display: none;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        min-height: 50vh;
        width: min(70vw, 640px);
        box-shadow: 0 20px 30px 10px rgba(0,0,0,0.3);
        padding: 0;
    }
    @media screen and (max-width: 700px) {
        .modal { width: 80vw; }
    }
    .modal.show {
        display: flex;
        animation: appear 0.4s ease-out forwards;
    }
    @keyframes appear {
        0% { 
            opacity: 0;
            transform: scale(0.3);
        }
        100% { 
            opacity: 1;
            transform: scale(1);
        }
    }
</style>