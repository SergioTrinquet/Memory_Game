import { createStore } from 'vuex'

export default createStore({
  state () {
    return {
        max_nb_players: 3,
        max_flipping_time_sec: 4,
        option_nb_pairs: [
          { nb_pairs: 6, 
            dispos: [
              { orientation: "portrait", dispo: { columns: 3, rows: 4 } },
              { orientation: "paysage", dispo: { columns: 4, rows: 3 } }
            ]
          }, 
          { 
            nb_pairs: 10,
            dispos: [
              { orientation: "portrait", dispo: { columns: 4, rows: 5 } },
              { orientation: "paysage", dispo: { columns: 5, rows: 4 } }
            ]
          },
          { 
            nb_pairs: 15,
            dispos: [
              { orientation: "portrait", dispo: { columns: 5, rows: 6 } },
              { orientation: "paysage", dispo: { columns: 6, rows: 5 } }
            ]
          }
        ],

        option_themes: [
          { intitule: "fruits", prefix: "fr" }, 
          { intitule: "noel", prefix: "no" }, 
          { intitule: "theme 3", prefix: "th3" }
        ],
        nb_pair_of_cards: null,
        theme: null,
        time_display_card: null,
        players: [],
        congratulations_message: [
          { tour: 1, mot: `🤙 Bravo` },
          { tour: 2, mot: "😃 Super" },
          { tour: 3, mot: "😄 Impressionnant" },
          { tour: 4, mot: "😲 Amazing" },
          { tour: 5, mot: "😆 Comment fais-tu" },
          { tour: 6, mot: "🤩 à la suite" }
        ],
        animation_message: [
          { 
            nom: 'countdown', 
            animations: [
              { scale: [0, 1], opacity: 1, duration: 300, easing: "easeInQuad" }, 
              { scale: 4, opacity: 1, duration: 300,  easing: "easeOutQuad" },
              { opacity: [1, 0], duration: 150, easing: "easeOutQuad" } 
            ]
          },
          {
            nom: 'tooLate',
            animations: [ 
              { opacity: [0.2, 1], rotate: ["-35deg", "0deg"], duration: 700, endDelay: 1200 }
            ]
          },
          {
            nom: 'fail',
            animations: [ 
              { opacity: [0.2, 1], translateY: ["-100vh", "0vh"], duration: 700, endDelay: 700/* , endDelay: 2700 */ }
            ]
          },
          {
            nom: 'followingFail',
            animations: [
              { opacity: [0, 1], scale: [0.4, 1], duration: 500, endDelay: 900, easing: "easeInQuad" }
            ]
          },
          { 
            nom: 'success', 
            animations: [
              { scale: [0, 1], opacity: 1, duration: 1000, rotate: '1turn', endDelay: 700 },
            ]
          },
          {
            nom: 'winner',
            animations: [
              { scale: [0, 1], opacity: [0, 1], rotate: '2turn', duration: 1200, endDelay: 1500 },
              { scale: 3, opacity: 0, duration: 400 }
            ]
          }
        ],
        msg_bt_change_dispo_cards: true,
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
    SET_DISPLAY_MSG_BT_CHANGE_DISPO_CARDS(state, payload) {
      state.msg_bt_change_dispo_cards = payload;
    },
  },


  getters: {
    getCongratulationsMessageById: (state) => (id) => {
      const obj = state.congratulations_message.find(msg => msg.tour == id);
      return obj.mot;
    },
    getMaxNbCongratulationsMessage (state) {
      return state.congratulations_message.length;
    },
    isAnimationNameValid: (state) => (id) => {
      const obj = state.animation_message.find(a => a.nom == id);
      return !!obj
    },
    getMessageAnimationByName: (state) => (id) => {
      const obj = state.animation_message.find(a => a.nom == id);
      //console.log("Getter", obj.animations); //TEST
      //if(typeof obj == "undefined") { console.log("obj est 'undefined !!!'") } //TEST

      return {
        nom: obj.nom,
        animations: obj.animations
      }
      
    },
    getSelectedNbPairOfCardsData: (state) => (orientation) => {
      const data = state.option_nb_pairs.find(o => o.nb_pairs == state.nb_pair_of_cards);
      const orientationDispo = data.dispos.find(d => d.orientation == orientation);
      //console.log("orientationDispo", orientationDispo, " | ", "orientationDispo.dispo.columns", orientationDispo.dispo.columns, " | ", "orientationDispo.dispo.rows", orientationDispo.dispo.rows); //TEST
      return { 
        columns: orientationDispo.dispo.columns, 
        rows: orientationDispo.dispo.rows 
      }
    },


    getPrimaryColor () {
      return getComputedStyle(document.documentElement).getPropertyValue('--bg-menu')
    }
    
  }

})
