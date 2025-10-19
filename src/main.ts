import './assets/main.css'

import './assets/main.css'
import './assets/js/fontawesome/all.min.js'

import './assets/js/no.js'
import VueTheMask from 'vue-the-mask';

// import axios from './../axiosConfig.ts'; /// Para rejeit
// import "bootstrap/dist/css/bootstrap.min.css"
// import "bootstrap"

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { registerSW } from 'virtual:pwa-register';


import App from './App.vue'
import router from './router'



const app = createApp(App)

app.use(createPinia())
app.use(router)

// app.config.globalProperties.$http = axios;
app.mount('#app')



registerSW({
  onNeedRefresh() {
    window.location.reload(); // força o reload quando há nova versão
  },
  onOfflineReady() {
    console.log('Aplicação pronta para uso offline.');
  },
});