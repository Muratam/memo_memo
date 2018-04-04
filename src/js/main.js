'use strict';
window.$ = window.jQuery = require('jquery');
import Vue from 'vue/dist/vue.esm.js';
import memoMemo from '../vue/memomemo.vue';
import MemoStore from '../js/memostore';
memoMemo.store = MemoStore;
new Vue(memoMemo).$mount('#app');
