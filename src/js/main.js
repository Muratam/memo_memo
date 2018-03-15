'use strict';
window.$ = window.jQuery = require('jquery');
require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap');
import Vue from 'vue/dist/vue.esm.js';
import TableTab from '../vue/tabletab.vue';
new Vue(TableTab).$mount('#app2');