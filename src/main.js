import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
import store from './store/index';

Vue.use(contentmenu)
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
