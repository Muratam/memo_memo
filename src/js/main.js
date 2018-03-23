'use strict';
window.$ = window.jQuery = require('jquery');
import Vue from 'vue/dist/vue.esm.js';
import TableTab from '../vue/tabletab.vue';
new Vue(TableTab).$mount('#app');