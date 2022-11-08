import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";

import './assets/css/guiStyle.css'
import './assets/css/styles-reset.css'


createApp(App).use(router).mount("#app");
