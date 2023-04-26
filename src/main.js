import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";

import './assets/css/guiStyle.css'
import './assets/css/styles-reset.css'
import './assets/css/font-awesome-4.7.0/css/font-awesome.min.css'

import 'vue-slider-component/theme/default.css'
import vClickOutside from "click-outside-vue3"
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import FloatingVue from 'floating-vue'

createApp(App)
  .use(router)
  .use(vClickOutside)
  .use(autoAnimatePlugin)
  .use(FloatingVue)
  .mount("#app");
