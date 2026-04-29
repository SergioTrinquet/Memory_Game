import { ref, computed } from 'vue'

export function useGameLogic(store) {
    const contentMsg = ref({ text: "", animationName: "" });
    const displayMenu = ref(null);
    const players = ref([]);
    let nbPlayers = 0;
    let useConfettisComposable = null;


    // -- ACTIONS PRIVEES  -- //

    async function useConfettisAsync() {
        const { useConfetti } = await import('@/composables/useConfettis.js');
        return useConfetti();
    }

    // Mélange des cartes
    const selectedNbPairOfCards = computed(() => store.state.nb_pair_of_cards);
    function setShuffledIdxCards() {
        let tempoArray = [];
        // On rempli le tableau de paires d'index...
        for(let i = 1; i <= selectedNbPairOfCards.value; i++) {
            tempoArray.unshift(i, i);
        }
        
        // ...On shuffle
        for (let i = tempoArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = tempoArray[i];
            tempoArray[i] = tempoArray[j];
            tempoArray[j] = temp;
        }
        
        return tempoArray;
    }

    // Gestion cartes retournées
    const delayBeforeMsgDisplayed = 1500;
    const delayDisplayMenu = 5000;
    let idxPlayer = 0;
    let timeoutFlipCardsMatch = null;
    let timeoutFlipCardsMiss = null;
    let timeoutDisplayMenu = null;

    async function flipCardsMatch() {
        timeoutFlipCardsMatch = setTimeout(async (cards) => {
            cards.forEach(c => cardsState.value[c.order] = 2); // Code pour dire que paire trouvée
            players.value[idxPlayer].score++; // Incrémentation score
            foundPairs++; // Incrémentation du nombre de paires trouvées par l'ensemble des joueurs ou le joueur
            successiveFoundPairsPerPlayer++;
            
            let text = "";
            let animationName = "";
            if(foundPairs == selectedNbPairOfCards.value) { // Si ttes les paires sont trouvées...
                text = getEndGameMessage(turns.value);
                animationName = 'winner';
                timeoutDisplayMenu = setTimeout(() => { displayMenu.value = true }, delayDisplayMenu);
                if(!useConfettisComposable) useConfettisComposable = await useConfettisAsync();
                useConfettisComposable.displayConfettis();
            } else { //...Sinon si jeu pas encore fini
                const msgPart = getCongratsMessage(successiveFoundPairsPerPlayer); // Message personnalisé qd coups gagnants successifs
                text = `!! ${msgPart} ${players.value[idxPlayer].nom.toUpperCase()} !!`;
                animationName = 'success';
            }
            contentMsg.value = { text, animationName };

            resetTurn();
        }, 
        delayBeforeMsgDisplayed, 
        cardsFlippedPerTurn)
    }

    function flipCardsMiss() {
        timeoutFlipCardsMiss = setTimeout((cards) => {
            cards.forEach(c => cardsState.value[c.order] = 0); // ...On retourne à nouveau les cartes
            successiveFoundPairsPerPlayer = 0;
            contentMsg.value = [{ text: "<span class='icon'>😬</span> Raté!", animationName: 'fail' }];

            if(nbPlayers > 1) {
                players.value[idxPlayer].turn = false;
                idxPlayer++;
                if(idxPlayer >= nbPlayers) idxPlayer = 0;  // Reset 'idxPlayer' qd dépasse le nb de joueurs           
                players.value[idxPlayer].turn = true;
                contentMsg.value.push({ text: ` A ton tour ${players.value[idxPlayer].nom}`, animationName: 'followingFail' });
            } 

            resetTurn();
        }, 
        delayBeforeMsgDisplayed, 
        cardsFlippedPerTurn)
    }
    
    // Réinitialisation après chaque tour d'un joueur
    function resetTurn() {
        nbFlipPlayer = 0;
        cardsFlippedPerTurn = [];
    }

    // Génération message personnalisé qd coups gagnants successifs
    const maxNbCongratsMessage = store.getters.getMaxNbCongratulationsMessage;
    function getCongratsMessage(count) {
        let id = (count > maxNbCongratsMessage ? maxNbCongratsMessage : count);
        return (count < maxNbCongratsMessage ? "" : count) + store.getters.getCongratulationsMessageById(id);
    }

    // Génération message final qd ttes les cartes sont trouvées
    function getEndGameMessage(nbTurns) {
        const scores = players.value.map(p => p.score);
        const maxScore = Math.max(...scores); // On détermine quel est le score max.
        const winners = players.value.filter(p => p.score === maxScore);

        if(winners.length > 1) { // Si plusieurs scores max. (donc plusieurs vainqueurs)...
            // On récupère noms des joueurs avec le plus grand score
            const namesEqualPlayers = winners.map(w => w.nom.toUpperCase()).join(" et ");
            return `!! 🤷 Egalité entre ${namesEqualPlayers} !!`
        } else { // Sinon si un seul score max: Un seul vainqueur
            const winner = winners[0];
            return (nbPlayers == 1) ? 
                    `👏 Bravo ${winner.nom.toUpperCase()}, partie terminée en ${nbTurns} tours` : 
                    `!! Et le/la gagnante est ${winner.nom.toUpperCase()} !!`;
        }
    }



    // -- ACTIONS PUBLIQUES -- //
    // Gestion flip + score
    const cardsState = ref([]);
    const turns = ref(0);
    const displayCountdown = ref(false);
    let idxCards = ref([]);

    const nbMaxFlipsPerTurn = 2;  // nb max de cartes qu'il est possible de retourner par tour et par joueur
    let cardsFlippedPerTurn = [], // Max 2 enregistrements possibles
        nbFlipPlayer = 0,   // nb de carte(s) retournée(s) par joueur
        foundPairs = 0,   // nb de paires trouvées par l'ensemble des joueurs
        successiveFoundPairsPerPlayer = 0;
    
    // Qd click sur coté verso d'une carte
    function flip(order) {
        if (nbFlipPlayer > nbMaxFlipsPerTurn) return
        nbFlipPlayer++;

        cardsState.value[order] = 1 // On retourne la carte
        cardsFlippedPerTurn.push({ "idx": idxCards.value[order], "order": order }); // Enregistrement idx et order de la carte

        // Apparition Décompte secondes
        if(nbFlipPlayer == 1) displayCountdown.value = true

        if(nbFlipPlayer == nbMaxFlipsPerTurn) { // Si 2eme carte tournée...
            // On arrete le countdown si le délai max n'est pas dépassé
            displayCountdown.value = false
            turns.value += 1;

            const idx_CardsFlippedPerTurn = cardsFlippedPerTurn.map(c => c.idx);  //console.log("idx_CardsFlippedPerTurn", idx_CardsFlippedPerTurn); //TEST
            // Check si cartes identiques ou pas 
            if([...new Set(idx_CardsFlippedPerTurn)].length == 1) flipCardsMatch() // ...Si les 2 cartes retournées identiques
            else flipCardsMiss()
        }
    }

    // Qd player n'a pas cliqué sur 2eme carte à temps (avant fin du décompte)
    function onCountdownOver() {
        contentMsg.value = { 
            text: `Trop tard ${players.value[idxPlayer].nom}`, 
            animationName: 'tooLate' 
        };
        flipCardsMiss();
        turns.value++; // Incrémentation du nombre de tours joués (même si pas de 2eme carte tournée)
        displayCountdown.value = false;
    }

    const clearMsg = ref(false);
    async function replay() {
        // On kill le timeout qui pourrait encore être en cours d'exécution pour le retournement des cartes gagnantes ou perdantes du tour précédent
        clearTimeout(timeoutFlipCardsMatch);
        clearTimeout(timeoutFlipCardsMiss); 
        clearTimeout(timeoutDisplayMenu);
        resetTurn();

        clearMsg.value = true;

        // Pour interrompre les animations de confettis en cours d'exécution si une nouvelle partie est lancée avant que les confettis de la partie précédente aient fini de tomber
        if(!useConfettisComposable) useConfettisComposable = await useConfettisAsync();
        useConfettisComposable.clearCanvas();

        newGame(); // On réinitialise
        displayMenu.value = false; // On ferme le menu
    }

    const nbCards = computed(() => selectedNbPairOfCards.value !== null ? parseInt(selectedNbPairOfCards.value) * 2 : 0 );
    const displayCardsGrid = computed(() => nbCards.value > 0 && idxCards.value.length > 0);
    function newGame() {
        const storePlayers = store.state.players;

        // Réinitialisation variables locales
        players.value = storePlayers.map(p => ({nom: p.nom, score: 0, turn: false})); // IMPORTANT : NE FAUT-IL PAS FAIRE UN MUTATION POUR CHANGER VALEUR DANS LE STORE
        idxPlayer = 0;
        foundPairs = 0;
        turns.value = 0;
        successiveFoundPairsPerPlayer = 0;
        idxCards.value = setShuffledIdxCards();
        cardsState.value = Array(nbCards.value).fill(0) // On réinitialise les cartes : Concrètement cela les retournent et retirent les marqueurs "founds"
    
        nbPlayers = players.value.length;
        if(nbPlayers > 1) players.value[idxPlayer].turn = true; // Au tour du 1er joueur

        // Msg d'intro
        contentMsg.value = [
            { text: "3", animationName: "countdown" },
            { text: "2", animationName: "countdown" },
            { text: "1", animationName: "countdown" },
            { text: "Go!", animationName: "countdown" }
        ]
    }

    const setDisplayMenu = () => { displayMenu.value = null };
    const setClearMsg = () => { clearMsg.value = false };

    return {
        players,
        cardsState,
        turns,
        displayCountdown,
        idxCards,
        nbCards,
        displayCardsGrid,
        clearMsg,
        contentMsg,
        displayMenu,
        newGame,
        flip,
        onCountdownOver,
        replay,
        setDisplayMenu,
        setClearMsg
    }
}