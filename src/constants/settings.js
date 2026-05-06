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
