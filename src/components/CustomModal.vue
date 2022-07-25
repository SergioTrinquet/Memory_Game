<template>
    <Modal :show="props.show" >
        <!-- <div class="etapes">
            <div>étape</div>
            <div>{{ props.currentModal }} / 4</div>
        </div> -->
        <div class="etapes">
            <div>étape {{ props.currentModal }} sur 4</div>
        </div>
        <div class="modal-legend">{{ props.legend }}</div>
        
        <slot/>

        <div class="modal-buttons">
            <slot name="buttons"></slot>
        </div>
    </Modal>
</template>

<script setup>
    import Modal from '@/components/base/BaseModal.vue'

    import { defineProps } from 'vue'
    const props = defineProps({ 
        show: {
            type: Boolean,
            required: true
        }, 
        legend: {
            type: String,
            required: true
        },
        currentModal: {
            type: Number,
            required: true
        }
    });
</script>

<style>
.etapes {
    text-align: center;
    position: absolute;
    z-index: 1;
    top: -2.7em;
    top: -1.7em;
}
.etapes * {
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-weight: 800;
    font-size: 20px;
}
.modal-legend {
    font-size: clamp(22px, 3.6vmin, 34px);
    line-height: clamp(24px, 4vmin, 34px);
    text-align: center;
    border-bottom: dotted min(4px, 0.5vmin) var(--color-primary-light);
}
.modal-legend,
.modal-buttons {
    width: 100%;
    padding: var(--padding-modal-settings);
}
.modal-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: var(--color-primary-light);
}
</style>