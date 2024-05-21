import './assets/main.css'
import 'tippy.js/dist/tippy.css' // optional for styling

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import mitt from 'mitt'
import App from './App.vue'
import VueTippy from 'vue-tippy'
import router from './router'

const emitter = mitt();
const pinia = createPinia()
const app = createApp(App)

app.use(
  pinia,
  VueTippy,
  {
    directive: 'tippy', // => v-tippy
    component: 'tippy', // => <tippy/>
    componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
    defaultProps: {
      placement: 'auto-end',
      allowHTML: true,
    }, // => Global default options * see all props
  }
)
app.use(router)
app.config.globalProperties.emitter = emitter
app.mount('#app')