import { reactive, computed, ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex'

export function useGridResponsive() {
    const store = useStore();

    const gridDisposition = reactive({  rows: 0, columns: 0 })
    const gridDimensions = reactive({ width: 0, height: 0 })  
    const gridDispositionProposition = reactive({ rows: 0, columns: 0  })
    const getOrientation = () =>  (window.matchMedia("(min-aspect-ratio:1/1)").matches) ? "paysage" : "portrait"

    // Attributs de style de la grille
    const styleGrid = computed(() => {
        return {
            'grid-template-columns': `repeat(${gridDisposition.columns}, 1fr)`,
            'grid-template-rows': `repeat(${gridDisposition.rows}, 1fr)`,
            'aspect-ratio': `${gridDisposition.columns} / ${gridDisposition.rows}`,
            'width': gridDimensions.width,
            'height': gridDimensions.height
        }
    })
    
    function setGridDimensions() {
        // Affectation variables servant à déterminer largeur ou hauteur de la grille de cartes afin que celle-ci ne déborde jamais de l'écran :
        // Détermination du point de bascule entre hauteur fixe / largeur auto, et largeur fixe / hauteur auto.
        const windowWidth = document.documentElement.clientWidth;
        const windowHeight = document.documentElement.clientHeight;
        const ratioMaxWidth = 0.8; // Pour 80vw
        const ratioMaxHeight = 0.7; // Pour 70vh

        const lengthSideCard = windowWidth * ratioMaxWidth / gridDisposition.columns;

        if((lengthSideCard * gridDisposition.rows) >= (windowHeight * ratioMaxHeight)) { // Si la hauteur de la grille dépasse la hauteur max autorisée (ici 70vh)...
            gridDimensions.width = "auto";
            gridDimensions.height = `${(ratioMaxHeight * 100)}vh`;
        } else {
            gridDimensions.width = `${(ratioMaxWidth * 100)}vw`;
            gridDimensions.height = "auto";
        }
    }

    const displayChangeCardsDispositonButton = ref(false)
    let lastValOrientation = null 
    // Suggestion d'une meilleure grille qd changement d'orientation/de proportion de l'écran (ex : portrait => paysage)
    function setGridRowsAndColumnsProposition() {
        const orientation = getOrientation();

        // Prevoir cas changement orientation mobile/tablette
        /* if(window.matchMedia("(hover:hover)").matches) {
            console.log("Ordi"); //TEST
        } else {
        console.log("Mobile/Tablette"); //TEST
        //if(window.matchMedia("orientation: portrait").matches) { }
        } */
        
        if(orientation !== lastValOrientation) { // Si changement orientation...
            // Récup nb lignes et colonnes idéales de la grid en fct° de l'orientation de l'écran
            const ideal = store.getters.getSelectedNbPairOfCardsData(orientation);
            setGridDisposition(ideal, gridDispositionProposition);

            // Affichage bouton pour demander à l'utilisateur s'il veut changer la dispo des cartes
            displayChangeCardsDispositonButton.value = (gridDispositionProposition.rows !== gridDisposition.rows);
        }
        lastValOrientation = orientation;
    }

// Initialisation (appelée au mount du jeu)
    const initGrid = () => {
        const orientation = getOrientation()
        const ideal = store.getters.getSelectedNbPairOfCardsData(orientation)

        // gridDisposition.rows = ideal.rows
        // gridDisposition.columns = ideal.columns
        setGridDisposition(ideal, gridDisposition);

        lastValOrientation = orientation
        setGridDimensions()  // Calcul largeur/hauteur grille
    }


    // --- GESTION DU RESIZE ---
    let resizeTimeout = null;
    const handleResize = () => {
        // Appel fonction que qd event 'resize' s'arrête pour des raisons de performance
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => { 
            setGridRowsAndColumnsProposition();
            setGridDimensions();
        }, 500); 
    }

    onMounted(() => window.addEventListener("resize", handleResize))
    onUnmounted(() => {
        window.removeEventListener("resize", handleResize)
        clearTimeout(resizeTimeout)
    })


    // Appelé qd click sur bt ds composant enfant pour changer disposition des cartes
    function onDispositionChanged() {   
        setGridDisposition(gridDispositionProposition, gridDisposition); // MAJ données gridDisposition       
        setGridDimensions(); // 2. Update CSS 'width' et 'height'
        displayChangeCardsDispositonButton.value = false; // Disparition composant bouton
    }

    function setGridDisposition(gridDispoFrom, gridDispoTo) {
        if('rows' in gridDispoFrom) gridDispoTo.rows = gridDispoFrom.rows;
        if('columns' in gridDispoFrom) gridDispoTo.columns = gridDispoFrom.columns;
    }

    return { 
        initGrid,
        gridDispositionProposition, 
        styleGrid, 
        onDispositionChanged, 
        displayChangeCardsDispositonButton
    }
}