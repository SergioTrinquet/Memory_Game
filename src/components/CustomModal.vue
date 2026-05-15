<template>
    <Modal :show="props.show">
        <div class="etapes" v-if="!props.fromMenuChangeParam">
            <div>étape {{ props.currentModal }} sur 4</div>
        </div>
        <div class="modal-legend">{{ props.legend }}</div>
        
        <slot/>

        <div class="modal-buttons" :class="{ 'from-menu-change-param': props.fromMenuChangeParam }">
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
        },
        fromMenuChangeParam: {
            type: Boolean,
            required: true
        }
    });
</script>

<style scoped>
.etapes {
    text-align: center;
    position: absolute;
    z-index: 1;
    top: min(-38px, -1.4em);
    * {
        color: #fff;
        font-family: 'Fredoka', sans-serif;
        font-weight: 500;
        font-size: min(5.8vmin, 23px);
    }
}
.modal-legend {
    font-size: clamp(22px, 3.6vmin, 34px);
    line-height: clamp(24px, 4vmin, 34px);
    text-align: center;
    border-bottom: dotted min(4px, 0.5vmin) var(--color-primary-light);
    text-wrap: balance;

    /* &:has(~ .from-menu-change-param) {
        --color-primary-light: hsl(from var(--color-primary) h s l / 0.15);
    } */
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
    gap: 3vh;

    &.from-menu-change-param {
        background-color: transparent;
        border-top: dotted min(4px, 0.5vmin) var(--color-primary-light);

        /* --color-primary-light: hsl(from var(--color-primary) h s l / 0.15); */
    }
}
</style>