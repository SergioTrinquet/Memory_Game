<template>
  <Header /> 
  <div class="modals">

    <!-- Nombre de joueurs -->
    <CustomModal 
      id="first-modal" 
      data-order="0"
      :show="selectedModal[0]" 
      :legend="'Sélectionnez le nombre de joueurs'"
      :current-modal="currentModal"
      :from-menu-change-param="fromMenuChangeParameter"
    >
      <div class="modal-content">
        <select v-model="nbOfPlayers"> 
          <option v-for="nb in maxNbPlayers" :key="nb" :value="nb">{{ nb }} joueur{{ nb > 1 ? 's' : '' }}</option>
        </select>
        <div class="wrapper-joueurs">
          <div v-for="idx in parseInt(nbOfPlayers)" :key="idx" class="lgn-joueur">
            <div class="input-joueur-wrapper">
              <input 
                type="text" name="joueur" 
                :placeholder="'Nom du joueur ' + idx" 
                v-model="inputsPlayers[idx - 1]"
                :class="{ 'error': !!msgErrorInputsPlayers[idx - 1] !== false }" 
              /> 
              <div v-if="msgErrorInputsPlayers[idx - 1] != ''" class="msg-error">{{ msgErrorInputsPlayers[idx - 1] }}</div>
            </div>
          </div> 
        </div>
      </div>

      <template #buttons>
        <ButtonSettings v-if="fromMenuChangeParameter"
            @click="stepBack"
            :direction="BUTTON_DIRECTION.BACKWARD" 
            :is-from-menu-change-parameter="fromMenuChangeParameter" 
          />
        <ButtonSettings 
          @click="recordNbPlayers"
          :direction="BUTTON_DIRECTION.FORWARD" 
          :is-from-menu-change-parameter="fromMenuChangeParameter" 
          :label-centered="true"
        />
      </template>
    </CustomModal>

    <!-- Nombre de paires -->
    <CustomModal 
      data-order="1"
      :show="selectedModal[1]" 
      :legend="'Combien de paires identiques'"
      :current-modal="currentModal"
      :from-menu-change-param="fromMenuChangeParameter"
    >
        <div class="select-settings-wrapper">
          <select 
            v-model="nbPairOfCards" 
            :class="{ 'error': errorSelectNbPair }"
          >
            <option v-for="nb in optionNbPairs" :key="nb">{{ nb }}</option>
          </select>
          <div v-if="errorSelectNbPair" class="msg-error">Veuillez sélectionner une valeur.</div>
        </div>

        <template #buttons>
          <ButtonSettings 
            @click="stepBack"
            :direction="BUTTON_DIRECTION.BACKWARD" 
            :is-from-menu-change-parameter="fromMenuChangeParameter" 
          />
          <ButtonSettings 
            @click="recordNbPairs"
            :direction="BUTTON_DIRECTION.FORWARD" 
            :is-from-menu-change-parameter="fromMenuChangeParameter" 
          />
        </template>
    </CustomModal>

    <!-- Sélection du thème -->
    <CustomModal 
      data-order="2"
      :show="selectedModal[2]" 
      :legend="'Choisissez un thème'"
      :current-modal="currentModal"
      :from-menu-change-param="fromMenuChangeParameter"
    >
      <div class="select-settings-wrapper">
        <select 
          v-model="theme"
          :class="{ 'error': errorTheme }"
        >
          <option v-for="theme in optionThemes" :key="theme">{{ theme }}</option>
        </select>
        <div v-if="errorTheme" class="msg-error">Veuillez sélectionner un thème.</div>
      </div>

      <template #buttons>
        <ButtonSettings 
          @click="stepBack"
          :direction="BUTTON_DIRECTION.BACKWARD" 
          :is-from-menu-change-parameter="fromMenuChangeParameter" 
        />
        <ButtonSettings 
          @click="recordTheme"
          :direction="BUTTON_DIRECTION.FORWARD" 
          :is-from-menu-change-parameter="fromMenuChangeParameter" 
        />
      </template>
    </CustomModal>

    <!-- Laps de temps max. entre 2 cartes -->
    <CustomModal 
      data-order="3"
      :show="selectedModal[3]" 
      :legend="'Laps de temps max. entre l\'apparition des 2 cartes'"
      :current-modal="currentModal"
      :from-menu-change-param="fromMenuChangeParameter"
    >
      <div class="range-settings-wrapper">
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
        <div class="result-seconds">{{ timeDisplayCard }} secondes</div>
      </div>    

      <template #buttons>
        <ButtonSettings 
          @click="stepBack"
          :direction="BUTTON_DIRECTION.BACKWARD"
          :is-from-menu-change-parameter="fromMenuChangeParameter" 
        />
        <ButtonSettings 
          @click="recordTimeVisibleCard"
          :direction="BUTTON_DIRECTION.FORWARD"
          :is-from-menu-change-parameter="fromMenuChangeParameter" 
        />
      </template>
    </CustomModal>

  </div>
</template>

<script setup>
  import Header from '@/components/Header.vue'
  import CustomModal from '@/components/CustomModal.vue'  
  import ButtonSettings from '@/components/ButtonSettings.vue';

  import { useStore } from 'vuex'
  import { ref, computed, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { 
    SETTINGS_SECTIONS,
    PARAMETERS_LIST, 
    OPTION_NB_PAIRS, 
    OPTION_THEMES, 
    MAX_NB_PLAYERS,
    BUTTON_DIRECTION
  } from '@/constants/settings.js'

  const store = useStore();
  const router = useRouter();
  const route = useRoute();
  
  const maxNbPlayers = MAX_NB_PLAYERS;
  const optionNbPairs = OPTION_NB_PAIRS.map(p => p.nb_pairs);
  const optionThemes = OPTION_THEMES.map(t => t.intitule);

  let selectedModal = ref([true, false, false, false]);
  let nbOfPlayers = ref("1");
  let nbPairOfCards = ref(null);
  let currentModal = ref(1);
  let inputsPlayers = ref([""]);
  let msgErrorInputsPlayers = ref([]);
  let errorSelectNbPair = ref(false);
  let theme = ref(null);
  let errorTheme = ref(false);
  let timeDisplayCard = ref(5);
  let fromMenuChangeParameter = ref(false); // pour savoir si on vient du menu pour changer les paramètres ou pas (car si oui, le libellé du bouton "suivant" doit être "valider")
  
  const objPlayer = computed(() => store.state.player);

  function stepBack(e) {
    if (route.params.section) {
      router.push({ name: 'jeu' });
    } else {
      moveTowardsModal(e, -1);
    }
  }

  // 1ere fenêtre modale
  function recordNbPlayers(e) {
    let playersArray = [];

    // Gestion msgs d'erreurs
    inputsPlayers.value.forEach((input, i) => {
      msgErrorInputsPlayers.value.splice(i, 1, "");  // On réinitie: Suppress° du texte d'erreur
      if(!!(input.trim()) == false) {  // Erreur qd champ est vide
        msgErrorInputsPlayers.value.splice(i, 1, "Veuillez remplir ce champ!"); // Si champ vide: Affichage texte d'erreur
      } else if(!!(/^[0-9a-z_-]+$/i.test(input.trim())) == false) { // Erreur qd saisie contient un autre caractère qu'une elttre, un chiffre, un _ ou un -
        msgErrorInputsPlayers.value.splice(i, 1, "Lettres, chiffres, _ ou - uniquement!")
      } else if(input.length < 2 || input.length > 10) { // Erreur qd pas assez ou trop de caractères
        msgErrorInputsPlayers.value.splice(i, 1, "Entre 2 et 10 caractères")
      }
    })

    // Pour savoir si ts les champs de saisie sont remplis ou pas
    const allInputsFilled = inputsPlayers.value.every(input => !!(input.trim()));  
    // Check saisies dupliquées ou pas
    const findDuplicates = inputsPlayers.value.filter((item, idx) => inputsPlayers.value.indexOf(item) !== idx)
    // Gestion msg d'erreur qd saisies identiques
    if(allInputsFilled) {
      findDuplicates.forEach(duplicate => {
        let idxError = inputsPlayers.value.lastIndexOf(duplicate);
        msgErrorInputsPlayers.value.splice(idxError, 1, "Nom déjà saisi!");
      })
    }

    // Check si msg d'erreurs existent
    const isMsgsError = msgErrorInputsPlayers.value.some(msg => msg !== "");
      
    // Si pas d'erreur(s) de saisie...  
    if(!isMsgsError) {
      inputsPlayers.value.forEach(input => {
        let joueur = { ...objPlayer };
        joueur.nom = input.trim();
        playersArray.push(joueur);
      });
      store.commit('SET_PLAYERS_NAMES', playersArray);  // Ajout enregistremnt dans var. du store 'players'
      
      if (route.params.section) {
        router.push({ name: 'jeu' });
      } else {
        moveTowardsModal(e, 1);
      }
    }
  }

  // 2eme fenêtre modale
  function recordNbPairs(e) {
    if(!!nbPairOfCards.value != false) {
      errorSelectNbPair.value = false;
      store.commit('SET_NB_PAIR_OF_CARDS', nbPairOfCards.value);  // Ajout enregistrement dans var. du store 'nb_pair_of_cards'
      
      if (route.params.section) {
        router.push({ name: 'jeu' });
      } else {
        moveTowardsModal(e, 1);
      }
    } else {
      errorSelectNbPair.value = true;
    }
  }

  // 3eme fenêtre modale
  function recordTheme(e) {
    if(!!theme.value != false) {
      errorTheme.value = false;
      store.commit('SET_THEME', theme.value);  // Ajout enregistremnt dans var. du store 'theme'
      
      if (route.params.section) {
        router.push({ name: 'jeu' });
      } else {
        moveTowardsModal(e, 1);
      }
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
    selectGoodModal(newOrder);
    // Mise à jour n° de la modale
    currentModal.value = (newOrder + 1);
  }

  function selectGoodModal(idx) {
    let temp_selectedModal = new Array(selectedModal.value.length).fill(false); // => [false, false, false, false]
    temp_selectedModal[idx] = true;
    selectedModal.value = [...temp_selectedModal];
  }

  function setInputDataWhenParamToModify(paramId) {
    switch (paramId) {
      case SETTINGS_SECTIONS.PLAYERS:
        nbOfPlayers.value = store.state.players.length;
        inputsPlayers.value = store.state.players.map(player => player.nom);
        break;
      case SETTINGS_SECTIONS.CARDS:
        nbPairOfCards.value = store.state.nb_pair_of_cards; 
        break;          
      case SETTINGS_SECTIONS.THEME:
        theme.value = store.state.theme;
        break;        
      case SETTINGS_SECTIONS.DELAY:
        timeDisplayCard.value = store.state.time_display_card;
        break;
      default:
        console.error("Erreur : Aucun paramètre ne correspond à celui sélectionné pour être modifié.");
        break;
    }
  }
  
  // Pour mettre à jour 'inputsPlayers' qd sélect° nb de joueurs
  watch(nbOfPlayers, (val) => {
    let upToDateInputsPlayers = [],
        upToDateMsgErrors = [];
    for(let i=0; i < parseInt(val); i++) {
      // Affectat° tableau saisie champ nom des joueurs
      let content = !!inputsPlayers.value[i] == false ? "" : inputsPlayers.value[i];
      upToDateInputsPlayers.push(content);

      // Affectat° tableau msg d'erreurs
      let msgError = !!msgErrorInputsPlayers.value[i] == false ? "" : msgErrorInputsPlayers.value[i];
      upToDateMsgErrors.push(msgError);
    }

    inputsPlayers.value = [...upToDateInputsPlayers];
    msgErrorInputsPlayers.value = [...upToDateMsgErrors];
  });  


  // Pour détecter si on vient du menu pour changer les paramètres
  watch(
    () => route.params.section,
    (val) => {
      fromMenuChangeParameter.value = !!val; // true si on vient du menu pour changer les paramètres, false sinon

      const param = PARAMETERS_LIST.find(p => p.id === val);
      if (param) {
        setInputDataWhenParamToModify(param.id); // Pour pré-remplir le(s) champ(s) de saisie de la modale avec les valeurs actuelles des paramètres à modifier
        selectGoodModal(param.modalIndex);
      }
    },
    { immediate: true }
  )
</script>

<style scoped>
.modals {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  color: rgb(255, 143, 164);
}

.select-settings-wrapper,
.wrapper-joueurs,
.input-joueur-wrapper,
.modal-content,
.msg-error {
  width: 100%;
}

.select-settings-wrapper .msg-error {
  width: calc(100% - (2 * var(--padding-modal-settings)));
}

.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: var(--padding-modal-settings);
}

.wrapper-joueurs {
  margin-top: 2.2vh;
}
.lgn-joueur {
  padding: 1.7vh 0;
  display: flex;
}
.input-joueur-wrapper {
  position: relative;
  input {
    margin: 0 auto;
    display: block;
  }
}
::placeholder {
  color: #6f6f6f;
}

option,
.msg-error {
  font-size: clamp(14px, 3vw, 17px);
}
input, 
select {
  font-size:clamp(17px, 3vmin, 20px);
}
select {
  width: 35%;
}

input[type="text"], 
select {
  border: 0;
  background-color: #e9e9e9;
  padding: 1vh 2vh;
  border-radius: 4px;
  &:focus {
    outline: 3px solid hsl(from var(--color-primary) h s calc(l + 35));
  }
}

.lgn-joueur input.error,
select.error {
  box-shadow: inset 0 0 0 2px var(--color-error);
}
.msg-error {
  color: var(--color-error);
  position: absolute;
}

.select-settings-wrapper {
  text-align: center;
  position: relative;
  padding: 0 var(--padding-modal-settings);
}

.range-settings-wrapper {
  width: 100%;
  padding: 0 var(--padding-modal-settings);
}
.range {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: min(3vmin, 24px);
  margin: 0 auto;
  width: 70%;
  span {
    margin: 0 8px;
  }
}
.range span,
.result-seconds {
  font-family: 'Fredoka', sans-serif; 
  font-size: clamp(20px, 4vmin, 24px);
  color: var(--color-primary);
}
.result-seconds {
  text-align: center;
  margin-top: 1.5vh;
}

input[type="range"] {
  -webkit-appearance: none;
  padding: 0;                   
  font: inherit;              
  outline: none;
  background: #e3dfdf;             
  box-sizing: border-box;    
  transition: opacity .2s;
  cursor: pointer;
  border-radius: 20px;
  height: clamp(8px, 1vmax, 12px);
  width: 100%;
  font-size: clamp(9px, 3vmin, 20px);
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: var(--color-primary-dark-1);
  cursor: ew-resize;
  box-shadow: 0 0 2px 0 #555;
  transition: background .3s ease-in-out;
}
input[type="range"]::-webkit-slider-runnable-track  {
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
}

#first-modal {
  input[type="text"], select {
    width: max(160px, 50%);
  }
}

@media screen and (max-width: 480px) {
  .lgn-joueur {
    align-items: center;
    flex-direction: column;
    padding: max(12px, 1.1vmin) 0;

    input[type="text"] {
      text-align: center;
    }
  }

  :deep(.libelle) {
    display: none;
  }

  select {
    width: 60%;
  }
}
</style>