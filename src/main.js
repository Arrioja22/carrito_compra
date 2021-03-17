// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Axios from 'axios';
import App from './App';
import vuetify from './plugins/vuetify';
import store from './store';

Vue.config.productionTip = false;

/* eslint-disable-next-line */
export const http = Axios.create({
  baseURL: process.env.HOST,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  vuetify,
  template: '<App/>',
  store,
});
