import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

import App from './App.vue';
import router from './router';
import store from './store';

import './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css'; // eslint-disable-line import/no-extraneous-dependencies
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
