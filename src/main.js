import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { projectAuth } from './firebase/config'

import "bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.rtl.min.css"
import "@/assets/css/fonts.css"

let app
projectAuth.onAuthStateChanged(() => {
    if (!app) {
        app = createApp(App).use(router).mount('#app')
    }
})
