<template>
    <div class="wrapper-bt-change-disposition">
        <div 
            class="msg-disposition-cartes" 
            :class="displayMsgInfo ?  '': 'hidden'"
        >
            <p>Pour une meilleure expérience, vous pouvez changer la disposition des cartes en cliquant sur le bouton ci-dessous afin d'avoir un affichage qui s'adapte au mieux aux dimensions de votre écran.</p>
            <p>Sachez cependant que cela peut perturber le(s) joueur(s), le but du jeu étant de mémoriser l'emplacement des cartes.</p>
            <button class="bt-close-msg" @click="closeMsgInfo">J'ai compris !</button>
        </div>

        <BaseButton
            class="bt-change-disposition"
            title="Changer la disposition"
            @click="changeDispositionCards" 
            rounded
        >
            {{ rowsColumnsGridCards }}
        </BaseButton>
    </div>
</template>

<script setup>
    import BaseButton from '@/components/base/BaseButton.vue'
    
    import { computed, defineEmits, defineProps } from 'vue'

    import { useStore } from 'vuex'
    const store = useStore();

    const prop = defineProps({ gridDispoProposition: Object })

    const displayMsgInfo = computed(() => store.state.msg_bt_change_dispo_cards)
    
    // Libellé bouton
    const rowsColumnsGridCards = computed(() => `${prop.gridDispoProposition.rows} lignes X ${prop.gridDispoProposition.columns} colonnes`)

    function closeMsgInfo() {
        store.commit('SET_DISPLAY_MSG_BT_CHANGE_DISPO_CARDS', false)
    }

    // Qd click bouton pour changer la disposition des cartes lorsque redimentionnement écran / chgmt orientation mobile
    const emit = defineEmits(['dispositionChanged']);
    function changeDispositionCards() {
        emit('dispositionChanged');
    }
</script>

<style scoped>
    .wrapper-bt-change-disposition {
        position: absolute;
        z-index: 1;
        bottom: var(--space-bottom-bt-change-disposition);
        flex-direction: column;
        align-items: center;
        display: flex;
    }
    .bt-change-disposition,
    .msg-disposition-cartes {
        background-color: #fff;
        color: var(--color-primary-dark-2);
    }
    .bt-change-disposition,
    .msg-disposition-cartes,
    .bt-close-msg {
        font-size: clamp(16px, 2.3vmax, 22px);
    }
    button.bt-change-disposition {
        padding: max(1vh, 4px) 20px;
        box-shadow: 0px 6px 8px rgba(0,0,0,0.3);
        width: min(80vw, 400px);
        animation: fadeInFromBottom 0.5s ease-in-out;
        z-index: 0;
    }
    @keyframes fadeInFromBottom {
        0% { 
            transform: translateY(var(--space-bottom-bt-change-disposition));
            opacity: 0; 
        }
        100% { 
            transform: translateY(0);
            opacity: 1; 
        }
    }

    .msg-disposition-cartes {
        line-height: clamp(20px, 4vmin, 400px);
        width: min(80vw, 700px);
        padding: 5.5vmin 4.5vmin;
        box-shadow: 0px 6px 8px rgba(0,0,0,0.3), 0 0 0px 100vh rgba(0, 0, 0, 0.7);
        margin-bottom: 60px;
        text-align: center;
        border-radius: 5px;
        /* Pour transition qd apparait */
        opacity: 0;
        animation: fadeInFromTop 0.6s ease-in-out 0.7s forwards;
    }
    @keyframes fadeInFromTop {
        0% { 
            transform: translateY(-20px);
            opacity: 0; 
        }
        100% { 
            transform: translateY(0);
            opacity: 1; 
        }
    }
    .msg-disposition-cartes::after {
        content: "";
        position: absolute;
        bottom: 0;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 30px 25px 0 25px;
        border-color: #fff transparent transparent transparent;
        left: 50%;
        transform: translate(-50%, 100%);
    }

    .msg-disposition-cartes.hidden {
        display: none;
    }

    .msg-disposition-cartes > * {
        font-family: 'Yeseva One', cursive;
    }
    .msg-disposition-cartes p {
        margin: 10px 0;
        font-size: inherit;
    }
    .msg-disposition-cartes .bt-close-msg {
        margin: 15px auto 0 auto;
        border: none;
        background-color: var(--color-primary-dark-2);
        color: #fff;
        padding: 1vh 3vw;
        border-radius: 8px;
        transition: 0.3s all ease-in-out;
    }
    .msg-disposition-cartes .bt-close-msg:hover {
        background-color: var(--color-primary-dark-3);
    }
</style>