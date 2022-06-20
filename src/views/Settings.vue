<template>
  <Header /> 
  <div class="modals">
    <div class="etapes">
      <div>{{ modalDone }} / 4</div>
    </div>
    
    <!-- Nombre de joueurs -->
    <Modal :show="selectedModal[0]">
      <div class="selection-nb-players">
        <div class="legend">Sélectionnez le nombre de joueurs</div>
        <select 
          v-model="nbOfPlayers"
          :class="{ 'error': errorSelectNbPlayers }"
        >
          <option v-for="nb in maxNbPlayers" :key="nb">{{ nb }}</option>
        </select>
        <div v-if="errorSelectNbPlayers" class="msg-error">Veuillez sélectionner une valeur.</div>
      </div>
<!-- inputsPlayers: {{ inputsPlayers }} -->  <!-- TEST -->
      <div>
        <div v-for="idx in parseInt(nbOfPlayers)" :key="idx" class="lgn-joueur">
          <label for="joueur" class="legend">Joueur {{ idx }}</label>
          <div>
            <input 
              type="text" name="joueur" 
              placeholder="Entrer un nom/pseudo" 
              v-model="inputsPlayers[idx - 1]"
              :class="{ 'error': msgErrorInputsPlayers[idx - 1] != '' }" 
            /> 
            <div v-if="msgErrorInputsPlayers[idx - 1] != ''" class="msg-error">{{ msgErrorInputsPlayers[idx - 1] }}</div>
          </div>
        </div> 
      </div>

      <div class="buttons" data-order="0" style="width: auto;">
        <Button libelle="Suivant" @click="recordNbPlayers" />
      </div>
    </Modal>


    <!-- Nombre de paires -->
    <Modal :show="selectedModal[1]">
      <div class="legend">Combien de paires identiques</div>

      <select 
        v-model="nbPairOfCards" 
        :class="{ 'error': errorSelectNbPair }"
      >
        <option v-for="nb in optionNbPairs" :key="nb">{{ nb }}</option>
      </select>
      <div v-if="errorSelectNbPair" class="msg-error">Veuillez sélectionner une valeur.</div>

      <div class="buttons" data-order="1">
        <Button libelle="Précédent" @click="stepBack" />
        <Button libelle="Suivant" @click="recordNbPairs" />
      </div>
    </Modal>


    <!-- Sélection du thème -->
    <Modal :show="selectedModal[2]">
      <div class="legend">Choisissez un thème</div>
      <select 
        v-model="theme"
        :class="{ 'error': errorTheme }"
      >
        <option v-for="theme in optionThemes" :key="theme">{{ theme }}</option>
      </select>

      <div class="buttons" data-order="2">
        <Button libelle="Précédent" @click="stepBack" />
        <Button libelle="Suivant" @click="recordTheme" />
      </div>
    </Modal>



    <Modal :show="selectedModal[3]">
      <div class="legend">Laps de temps max. entre l'appartion des 2 cartes</div>
      <div>
        <div class="range">
          <span>3</span>
          <input 
            type="range" 
            v-model="timeDisplayCard" 
            min="3" max="15" 
            step="1"
          >
          <span>15</span>
        </div>
        <div class="result-seconds">{{ timeDisplayCard }} <span>secondes</span></div>
      </div>

      <div class="buttons" data-order="3">
        <Button libelle="Précédent" @click="stepBack" />
        <Button libelle="Suivant" @click="recordTimeVisibleCard" />
      </div>
    </Modal> 
   

  </div>
</template>

<script setup>
  import Header from '@/components/Header.vue'
  import Modal from '@/components/base/BaseModal.vue'
  import Button from '@/components/base/baseButtonSettings.vue'

  import { useStore } from 'vuex'
  import { ref, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'

  let selectedModal = ref([true, false, false, false]);
  let nbOfPlayers = ref(0);
  let nbPairOfCards = ref(null);
  let modalDone = ref(1);
  let inputsPlayers = ref([]);
  let errorSelectNbPlayers = ref(false);
  let msgErrorInputsPlayers = ref([]);
  let errorSelectNbPair = ref(false);
  let theme = ref(null);
  let errorTheme = ref(false);
  let timeDisplayCard = ref(5);

  const store = useStore();
  const router = useRouter();
  
  const maxNbPlayers = computed(() => store.state.max_nb_players);
  //const optionNbPairs = computed(() => store.state.option_nb_pairs);
  const optionNbPairs = computed(() => store.state.option_nb_pairs.map(p => p.nb_pairs));
  const optionThemes = computed(() => store.state.option_themes.map(t => t.intitule));
  const objPlayer = computed(() => store.state.player);

  
  function stepBack(e) {
    moveTowardsModal(e, -1);
  }

  // 1ere fenêtre modale
  function recordNbPlayers(e) {
    if(inputsPlayers.value.length == 0) {
      errorSelectNbPlayers.value = true;
      return false;
    }

    let playersArray = [];

    // Pour savoir si ts les champs de saisie sont remplis ou pas
    const allInputsFilled = inputsPlayers.value.every(input => !!(input.trim()));  
    //console.log("allInputsFilled", allInputsFilled); //TEST
    // Check saisies dupliquées ou pas
    const findDuplicates = inputsPlayers.value.filter((item, idx) => inputsPlayers.value.indexOf(item) !== idx)
    //console.log("findDuplicates", findDuplicates); //TEST

    
    // Gestion msg d'erreur qd chp(s) de saisie vide
    inputsPlayers.value.forEach((input, i) => {
      msgErrorInputsPlayers.value.splice(i, 1, "");  // On réinitie: Suppress° du texte d'erreur
      if(!!(input.trim()) == false) msgErrorInputsPlayers.value.splice(i, 1, "Veuillez remplir ce champ!"); // Si champ vide: Affichage texte d'erreur
    })

    // Gestion msg d'erreur qd saisies identiques
    if(allInputsFilled) {
      findDuplicates.forEach(duplicate => {
        let idxError = inputsPlayers.value.lastIndexOf(duplicate);
        msgErrorInputsPlayers.value.splice(idxError, 1, "Nom déjà saisi!");
      })
    }
      
    // Si pas d'erreur(s) de saisie...  
    if(allInputsFilled && findDuplicates.length == 0) {
      inputsPlayers.value.forEach(input => {
        let joueur = { ...objPlayer };
        joueur.nom = input.trim();
        playersArray.push(joueur);
      });
      //console.log("playersArray", playersArray); //TEST
      store.commit('SET_PLAYERS_NAMES', playersArray);  // Ajout enregistremnt dans var. du store 'players'
      moveTowardsModal(e, 1);
    }
  }



  // 2eme fenêtre modale
  function recordNbPairs(e) {
    if(!!nbPairOfCards.value != false) {
      errorSelectNbPair.value = false;
      store.commit('SET_NB_PAIR_OF_CARDS', nbPairOfCards.value);  // Ajout enregistremnt dans var. du store 'nb_pair_of_cards'
      moveTowardsModal(e, 1);
    } else {
      errorSelectNbPair.value = true;
    }
  }

  // 3eme fenêtre modale
  function recordTheme(e) {
    if(!!theme.value != false) {
      errorTheme.value = false;
      store.commit('SET_THEME', theme.value);  // Ajout enregistremnt dans var. du store 'theme'
      moveTowardsModal(e, 1);
    } else {
      errorTheme.value = true;
    }
  }

  // 4eme fenêtre modale
  function recordTimeVisibleCard() {
    store.commit('SET_TIME_DISPLAY_CARD', timeDisplayCard.value);  // Ajout enregistremnt dans var. du store 'theme'
    router.push({ name: 'jeu' }) // Redirection vers page 'Settings'
  }


  function moveTowardsModal(e, step) {
    // On détermine le numéro de la modale que l'on doit afficher
    let order = e.target.closest('[data-order]').dataset.order;
    const newOrder = parseInt(order) + step;
    // Affectat° var. qui va afficher et cacher les bonnes modales
    let temp_selectedModal = [false, false, false, false];
    temp_selectedModal[newOrder] = true;
    selectedModal.value = [...temp_selectedModal];
    // Mise à jour n° de la modale
    modalDone.value = (newOrder + 1);
  }
  
  // Pour mettre à jour 'inputsPlayers' qd sélect° nb de joueurs
  watch(nbOfPlayers, (val) => {
    errorSelectNbPlayers.value = false; // Réinitialisation

    let newArray = [];
    for(var i=0; i < parseInt(val); i++) {
      var content = !!inputsPlayers.value[i] == false ? "" : inputsPlayers.value[i];
      newArray.push(content);
      // Affectat° tableau msg d'erreurs
      msgErrorInputsPlayers.value.push("");
    }
    //console.log(newArray); //TEST

    inputsPlayers.value = [...newArray];
  });  
</script>

<style scoped>
.modals {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  color: rgb(255, 79, 112);
  color: rgb(255, 143, 164);
}
select option {
  color: rgb(255, 79, 112);
  color: rgb(255, 143, 164);
}
.etapes {
  padding: max(35px, 5vmin);
  z-index: 1;
  transform: rotate(45deg) translate(max(24.5px, 3.5vmin), max(24.5px, 3.5vmin));
  background-color: rgb(255, 143, 164);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 0 4px #9c00d9;
}
.etapes > div {
  position: absolute;
  z-index: 1;
  color: #f7f7f7;
  transform: rotate(-45deg);
  font-family: 'Yeseva One', cursive;
  width: 10vw;
  text-align: center;
  text-shadow: 0 2px 0px rgba(153, 0, 213, 0.6);
  letter-spacing: -0.05em;
  min-width: 70px;
}

.legend {
  font-size: clamp(26px, 6vmin, 38px);
  line-height: clamp(26px, 6vmin, 38px);
}

.selection-nb-players {
  text-align: center;
}
.lgn-joueur {
  padding: 1.7vh 0;
  display: flex;
}
.lgn-joueur label {
  margin: 0 10px 0 0;
}
.lgn-joueur input.error,
select.error {
  border: solid 2px var(--color-error);
}
.msg-error {
  color: var(--color-error);
  position: absolute;
}
.buttons {
  display: flex;
  flex-direction: row;
  width: 80%;
}
.range {
  display: flex;
  justify-content: center;
}
.range span {
  margin: 0 8px;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  color: #9400CD;
}
.result-seconds {
  text-align: center;
}

input[type="range"] {
  cursor: pointer;
}

/* input[type="range"] {
-webkit-appearance: none;
  padding: 0;                   
  font: inherit;              
  outline: none;
  color: #9400CD;                 
  opacity: .8;
  background: #CCC;             
  box-sizing: border-box;    
  transition: opacity .2s;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #ff4500;
  cursor: ew-resize;
  box-shadow: 0 0 2px 0 #555;
  transition: background .3s ease-in-out;
}

input[type="range"]::-webkit-slider-runnable-track  {
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
} */

</style>
