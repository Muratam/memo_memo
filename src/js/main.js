'use strict';
window.$ = window.jQuery = require('jquery');
import Vue from 'vue/dist/vue.esm.js';
import MemoMemo from '../vue/memomemo.vue';
import MemoStore from '../js/memostore';
MemoMemo.store = MemoStore;
new Vue(MemoMemo).$mount('#app');
