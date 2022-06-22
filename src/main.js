import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'


/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import specific icons */
import { faArrowRight, faCircleArrowRight, faCircleArrowLeft, faCheck, faBars, faXmark, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(faArrowRight, faCircleArrowRight, faCircleArrowLeft, faCheck, faBars, faXmark, faExclamationCircle)
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


createApp(App)
    .use(store)
    .use(router)
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount('#app')
