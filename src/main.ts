import Vue from 'vue';
import App from './App.vue';
import store from './vuexDatastore/store';
import './style.css';
// @ts-ignore
import 'vue2-datepicker/index.css';
import './assets/styles/datepicker.scss';
// @ts-ignore


//Filter for formatting numbers so that they have commas and no decimals
Vue.filter('numberWithCommasNoDecimals', function (number:any ) {
  return (new Intl.NumberFormat('en-GB', {minimumFractionDigits:0, maximumFractionDigits:0}).format(number) !== 'NaN'?new Intl.NumberFormat('en-GB', {minimumFractionDigits:0, maximumFractionDigits:0}).format(number):'');
});

Vue.config.productionTip = false;
new Vue({
  store,

  // router,
  render: (h) => h(App)
}).$mount('#app');



