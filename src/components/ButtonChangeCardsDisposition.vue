<template>
    <div 
        class="wrapper-bt-change-disposition"
        :class="displayTemplate ? 'is-displayed' : ''"
    >
        <div 
        class="msg-disposition-cartes" 
        :class="displayTemplate && displayMsgInfo ?  'is-displayed': ''"
        >
        <p>Pour une meilleure expérience, vous pouvez changer la disposition des cartes en cliquant sur le bouton ci-dessous afin d'avoir un affichage qui s'adapte au mieux aux dimensions de votre écran.</p>
        <p>Sachez cependant que cela peut perturber le(s) joueur(s), le but du jeu étant de mémoriser l'emplacement des cartes.</p>
        <button class="bt-close-msg" @click="displayMsgInfo = false">J'ai compris !</button>
        </div>

        <!-- <div>Changer la disposition des cartes</div> -->
        <button 
            class="bt-change-disposition" 
            @click="changeDispositionCards" 
            title="Changer la disposition"
        >
            {{ rowsColumnsGridCards }}
        </button>
    </div>
</template>

<script setup>
    import { computed, reactive, ref, defineEmits } from 'vue'
    import { useStore } from 'vuex'

    const store = useStore()

    const gridDisposition = computed(() => store.state.grid_disposition)
    const gridDisposition_Prop = reactive({ rows: 0, columns: 0 })
    const displayTemplate = ref(false)  //const displayTemplate = computed(() => store.state.display_template)
    const displayMsgInfo = ref(true)
    let lastValOrientation = ""

    // Libellé bouton
    const rowsColumnsGridCards = computed(() => `${gridDisposition_Prop.rows} lignes X ${gridDisposition_Prop.columns} colonnes`)

    // Aussi présent dans 'Game.vue' : En faire un Composable !!
    const getOrientation = () =>  (window.matchMedia("(min-aspect-ratio:1/1)").matches) ? "paysage" : "portrait"


    function getGridRowsAndColumnsProposition() {
        const orientation = getOrientation();

        // Prevoir cas changement orientation mobile/tablette
        /* if(window.matchMedia("(hover:hover)").matches) {
            console.log("Ordi"); //TEST
        } else {
        console.log("Mobile/Tablette"); //TEST
        //if(window.matchMedia("orientation: portrait").matches) { }
        } */
        
        if(orientation !== lastValOrientation) { // Si changement orientation...
            // Récup nb lignes et colonnes de la grid en fct° de l'orientation de l'écran
            const { columns, rows } = store.getters.getSelectedNbPairOfCardsData(orientation);
            gridDisposition_Prop.rows = rows;
            gridDisposition_Prop.columns = columns;

            // Affichage bouton pour demander à l'utilisateur s'il veut changer la dispo des cartes
            displayTemplate.value = (gridDisposition_Prop.rows !== gridDisposition.value.rows) ? true : false;
            /* TEST */ //store.commit('SET_DISPLAY_TEMPLATE', (gridDisposition_Prop.rows !== gridDisposition.value.rows) ? true : false);
        }
        lastValOrientation = orientation;
    }

    let sto = null;
    window.addEventListener("resize", () => {
        // Appel fonction que qd event 'resize' s'arrête pour des raisons de performance
        clearTimeout(sto);
        sto = setTimeout(getGridRowsAndColumnsProposition, 500);
    })


    // Qd click bouton pour changer la disposition des cartes lorsque redimentionnement écran / chgmt orientation mobile
    const emit = defineEmits(['dispositionChanged']);
    function changeDispositionCards() {
        // MAJ données gridDisposition
        store.commit('SET_GRID_DISPOSITION', gridDisposition_Prop);
        // Pour MAJ styles CSS de la grid
        emit('dispositionChanged');
        // Disparition bouton
        displayTemplate.value = false;
        /* TEST */ //store.commit('SET_DISPLAY_TEMPLATE', false);
    }

</script>

<style scoped>
    .wrapper-bt-change-disposition {
        position: absolute;
        z-index: 1;
        bottom: 5vh;
        flex-direction: column;
        align-items: center;
        display: flex;
        
        pointer-events: none; 
        opacity: 0;
    }
    .wrapper-bt-change-disposition.is-displayed {
        pointer-events: initial;
        opacity: 1;
    }
    .bt-change-disposition,
    .msg-disposition-cartes {
        background-color: #fff;
        color: #64008B;
        border-radius: 5px;
    }
    .bt-change-disposition,
    .msg-disposition-cartes,
    .bt-close-msg {
        font-size: clamp(18px, 3.2vw, 22px);
    }
    .bt-change-disposition {
        padding: max(1vh, 4px) 20px;
        border: none;
        box-shadow: 0px 6px 8px rgba(0,0,0,0.3);
        width: min(80vw, 400px);

        /* Pour transition qd apparait */
        transition: 0.5s transform ease-in-out, 0.5s opacity ease-in-out;
        transform: translateY(20px);
        opacity: 0;
    }

    .wrapper-bt-change-disposition.is-displayed .bt-change-disposition {
        transform: translateY(0);
        opacity: 1;
    }

    /* :deep(.msg-disposition-cartes) */
    .msg-disposition-cartes {
        line-height: clamp(20px, 4vmin, 400px);
        width: min(80vw, 700px);
        padding: 5.5vmin 4.5vmin;
        box-shadow: 0px 6px 8px rgba(0,0,0,0.3), 0 0 0px 100vh rgba(0, 0, 0, 0.7);
        margin-bottom: 60px;
        text-align: center;

        /* Pour transition qd apparait */
        transition: 0.5s transform ease-in-out 0.5s, 0.5s opacity ease-in-out 0.5s;
        transform: translateY(-20px);
        opacity: 0;
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
    .msg-disposition-cartes > * {
        font-family: 'Yeseva One', cursive;
    }
    .msg-disposition-cartes p {
        margin: 10px 0;
        font-size: inherit;
    }
    .msg-disposition-cartes.is-displayed,
    .msg-disposition-cartes .bt-close-msg {
        transform: translateY(0);
        opacity: 1;
    }
    .msg-disposition-cartes .bt-close-msg {
        margin: 15px auto 0 auto;
        border: none;
        background-color: #64008b;
        color: #fff;
        padding: 1vh 3vw;
        border-radius: 8px;
        transition: 0.3s all ease-in-out;
    }
    .msg-disposition-cartes .bt-close-msg:hover {
        background-color: #510170;
    }
</style>