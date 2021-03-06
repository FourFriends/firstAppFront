import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'

Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(ElementUI)
import 'element-ui/lib/theme-chalk/index.css'

new Vue({
  render: h => h(App),
}).$mount('#app')
