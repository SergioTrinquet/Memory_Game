<template>
    <dialog 
        ref="dialogRef"
        @cancel.prevent="handleCancel"
    >
        <p>Vous n'avez pas terminé la partie.</p>
        <p>Etes-vous sûr de vouloir quitter?</p>
        <div>
            <button @click="$emit('dialogMenuConfirmQuit')">
                Oui
            </button>
            <button @click="$emit('dialogMenuCancelQuit')">
                Non
            </button>
        </div>
    </dialog>
</template>

<script setup>
import { defineProps, useTemplateRef, watch } from 'vue'

const { open } = defineProps({
    open: Boolean
})

const emit = defineEmits(['dialogMenuConfirmQuit', 'dialogMenuCancelQuit']);
const dialogRef = useTemplateRef('dialogRef');

function handleCancel() {
    emit('dialogMenuCancelQuit');
}

watch(() => open, (newValue) => {
    const dialog = dialogRef.value;
    if(!dialog) return;

    if (newValue) {
        dialog.showModal();
    } else {
        dialog.close();
    }
})
</script>

<style scoped>
    dialog {
        @starting-style {
            opacity: 0;
            transform: translate(-50%, -10%);
        }
        transition: opacity 0.3s ease, transform 0.3s ease;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        padding: 2rem;
        border-radius: 8px;
        border-width: 0;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
        width: min(70vw, 460px);
        z-index: 1000;
        
        p {
            font-family: 'Fredoka', sans-serif;
            font-size: 1.25rem;
            text-align: center;
        }

        div:has(button) {
            display: flex;
            gap: 1rem;
        }

        button {
            padding: 0.5rem 1rem;
            font-size: 1rem;
            font-weight: 500;
            border-radius: 5px;
            border-width: 0;
            cursor: pointer;
            margin: 1rem 0 0;
            transition: background-color 0.3s ease-in-out;
            background-color: var(--color-primary);
            color: #fff;
            &:hover {
                background-color: var(--color-primary-dark-2);
            }

            /* &:last-child {
                background-color: transparent;
                color: var(--color-primary);
                box-shadow: inset 0 0 0 2px var(--color-primary);
                &:hover {
                    background-color: var(--color-secondary-dark-2);
                }
            } */
        }
    }

    ::backdrop {
        background-color: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(8px);
    }
</style>