import { createStore } from 'vuex'
import { OPTION_NB_PAIRS } from '@/constants/settings.js'

export default createStore({
  state () {
    return {
        // Paramètres dynamiques de la partie
        nb_pair_of_cards: null,
        theme: null,
        time_display_card: null,
        players: [],
        // Structure de base pour un joueur
        player: { nom: "", score: 0, turn: false }
    }
  },

  mutations: {
    SET_PLAYERS_NAMES(state, payload) {
      state.players = payload;
    },
    SET_NB_PAIR_OF_CARDS(state, payload) {
      state.nb_pair_of_cards = payload;
    },
    SET_THEME(state, payload) {
      state.theme = payload;
    },
    SET_TIME_DISPLAY_CARD(state, payload) {
      state.time_display_card = payload;
    },
  },

  getters: {
    getSelectedNbPairOfCardsData: (state) => (orientation) => {
      const data = OPTION_NB_PAIRS.find(o => o.nb_pairs == state.nb_pair_of_cards);
      if (!data) return null;
      const orientationDispo = data.dispos.find(d => d.orientation == orientation);
      return { 
        columns: orientationDispo.dispo.columns, 
        rows: orientationDispo.dispo.rows 
      }
    }
  }
})
