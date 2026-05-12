export const SETTINGS_SECTIONS = {
    PLAYERS: 'players',
    CARDS: 'cards',
    THEME: 'theme',
    DELAY: 'delay'
};

export const PARAMETERS_LIST = [
    { id: SETTINGS_SECTIONS.THEME, label: 'thème', modalIndex: 2 },
    { id: SETTINGS_SECTIONS.PLAYERS, label: 'joueur(s)', modalIndex: 0 },
    { id: SETTINGS_SECTIONS.CARDS, label: 'nombre de cartes', modalIndex: 1 },
    { id: SETTINGS_SECTIONS.DELAY, label: 'délai entre les cartes', modalIndex: 3 }
];

export const MAX_NB_PLAYERS = 3;

export const OPTION_NB_PAIRS = [
    { 
        nb_pairs: 6, 
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
];

export const OPTION_THEMES = [
    { intitule: "fruits" }, 
    { intitule: "noel" }, 
    { intitule: "halloween" },
    { intitule: "fleurs" },
    { intitule: "super-heros" }
];

export const CONGRATULATIONS_MESSAGES = [
    { tour: 1, mot: `🤙 Bravo` },
    { tour: 2, mot: "😃 Super" },
    { tour: 3, mot: "😄 Impressionnant" },
    { tour: 4, mot: "😲 Amazing" },
    { tour: 5, mot: "😆 Comment fais-tu" },
    { tour: 6, mot: "🤩 à la suite" }
];

export const ANIMATION_MESSAGES = [
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
            { opacity: [0.2, 1], translateY: ["-100vh", "0vh"], duration: 700, endDelay: 2700 }
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
];


export const BUTTON_DIRECTION = {
  BACKWARD: 'backward',
  FORWARD: 'forward'
}

//// A FAIRE /////
// export const BUTTON_VARIANTS = {} // 'action', 'menu'
// export const BUTTON_HOVER_BG_SIDE = {} // 'left', 'right'
// 'from', 'color' // Voir si encore utile