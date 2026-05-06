<template>
    <!-- <button class="select-parameters">
        <div id="main-label" @click="toggleParameters">Changer un paramètre</div>
        <div @click="redirectToParameter">
            <span v-for="(parameter, i) in parameters" :key="i" :id="parameter.id">{{ parameter.label }}</span>
        </div>
    </button> -->
    <BaseButton variant="menu" class="select-params">
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
    import { PARAMETERS_LIST } from '@/constants/settings.js'
    const router = useRouter();

    const parameters = PARAMETERS_LIST;

    function toggleParameters(e) {
        e.stopPropagation(); // pour éviter que le click sur le label ne déclenche aussi le click sur le menu (car le label est dans le menu)
        e.target.classList.toggle('list-parameters-hidden'); // toggle de la classe qui affiche ou non la liste des paramètres à changer
    }
    function redirectToParameter(e) {
        const id = e.target.id;
        if(parameters.some(parameter => parameter.id === id)) {
            router.push({ name: 'parametres', params: { section: id } });
        }
    }
</script>

<style scoped>
/* .select-parameters {
    border-style: solid;

    border-radius: 5vh;
    border-width: 4px;
    border-color: var(--color-primary);
    color: var(--color-primary);
    background-color: transparent;

    font-weight: 500;
    cursor: pointer;

    #main-label {
        font-size: clamp(18px, 3.5vw, 26px);
        text-align: center;

        & + * {
            display: none;
            flex-direction: column;
        }
        &.list-parameters-hidden + * {
            display: flex;
        }
    }
} */


/* style uniquement pour la version avec BaseButton */
.select-params {
    border-radius: 5vh;

    #main-label {
        & + * {
            /* display: none; */
            list-style: none;

            transition: all 0.3s ease-in-out;
            height: 0;
            overflow: hidden;
            interpolate-size: allow-keywords;
        }
        &.list-parameters-hidden + * {
            display: block;
            margin: 1vh 0 0 0;
            height: auto;
        }
    }

    li {
        padding: 0.5vh 0;
        span {
            position: relative;
            &:after {
                content: "";
                position: absolute;
                width: 0%;
                height: 2px;
                top: 100%;
                left: 50%;
                background-color: #fff;
                border-radius:3px;
                transition: all 0.2s ease-in-out;
            }
            &:hover:after {
                left: 0;
                width: 100%;
            }
        }
    }
}
</style>

