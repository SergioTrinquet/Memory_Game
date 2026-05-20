<template>
    <BaseButton :variant="BUTTON_VARIANTS.MENU">
        <span id="main-label" @click="toggleParameters">Changer un paramètre</span>
        <ul @click="redirectToParameter">
            <li v-for="(parameter, i) in parameters" :key="i" >
               <span :id="parameter.id">{{ parameter.label }}</span>
            </li>
        </ul>
    </BaseButton>
</template>

<script setup>
    import BaseButton from '@/components/base/BaseButton.vue'
    import { useRouter } from 'vue-router'
    import { PARAMETERS_LIST, BUTTON_VARIANTS } from '@/constants/settings.js'
    
    const router = useRouter();

    const parameters = PARAMETERS_LIST;

    const props = defineProps({
        checkWhetherGameStartedAndExecute: { 
            type: Function,
            default: (fn) => fn()
         }
    })

    function toggleParameters(e) {
        e.stopPropagation(); // pour éviter que le click sur le label ne déclenche aussi le click sur le menu (car le label est dans le menu)
        e.target.classList.toggle('list-parameters-hidden'); // toggle de la classe qui affiche ou non la liste des paramètres à changer
    }
    function redirectToParameter(e) {
        const id = e.target.id;
        if(parameters.some(parameter => parameter.id === id)) {
            // On enveloppe la redirection dans la fonction 'checkWhetherGameStartedAndExecute' passée en prop depuis le composant parent (Header.vue) pour vérifier s'il y a une partie en cours avant de rediriger vers la page de paramètres
            props.checkWhetherGameStartedAndExecute(() => {
                router.push({ name: 'parametres', params: { section: id } });
            });
        }
    }
</script>

<style scoped>
button {
    --padding-size: 3vmin;
    --color-delimitation-menu-submenu: var(--color-primary);

    border-radius: 5vh;
    padding: 0;

    #main-label {
        display: grid;
        padding: var(--padding-size);

        & + * {
            transition: all 0.3s ease-in-out;
            height: 0;
            overflow: hidden;
            interpolate-size: allow-keywords;
            
            list-style: none;
            padding-inline: var(--padding-size);
        }
        &.list-parameters-hidden + * {
            display: block;
            height: auto;
        }
    }
    
    li {
        padding: 0.6vh 0;
        
        &:first-child {
            transition: border-top 0.3s ease-in-out;
            border-top: dashed 1px var(--color-delimitation-menu-submenu);
            padding-top: calc(var(--padding-size) - 1vmin);
        }
        &:last-child {
            padding-bottom: var(--padding-size);
        }

        span {
            position: relative;
            &:after {
                content: "";
                position: absolute;
                width: 0%;
                height: 2px;
                top: 100%;
                left: 50%;
                background-color: var(--color-secondary-bt-menu);
                border-radius:3px;
                transition: all 0.2s ease-in-out;
            }
            &:hover:after {
                left: 0;
                width: 100%;
            }
        }
    }

    &:hover li:first-child {
        --color-delimitation-menu-submenu: var(--color-secondary-bt-menu);
    }
}
</style>

