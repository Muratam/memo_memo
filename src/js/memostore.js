import Vue from 'vue/dist/vue.esm.js';
import Vuex from 'vuex';
import {mutation} from '../js/common'
import SaveData from '../js/savedata';

Vue.use(Vuex);
Array.prototype.groupBy = function(keyFunc) {
  let res = {};
  this.forEach(c => {
    let key = keyFunc(c);
    if (key in res)
      res[key].push(c);
    else
      res[key] = [c];
  });
  // WARN: 暗黙の型変換が入るので注意！！
  return Object.keys(res).map(k => ({key: k, value: res[k]}));
};

export default new Vuex.Store({
  state: {
    genres: [],
    hows: [],
    contents: [],
    currentGenre: 'all',
    currentHow: 'all',
    findQuery: '',
    saveData: new SaveData('webSocket')
  },
  getters: {
    howName: state => howId => {
      for (let how of state.hows) {
        if (how.id === howId) return how.name;
      }
      console.log('no how', howId);
      return 'all';
    },
    genreName: state => genreId => {
      for (let genre of state.genres) {
        if (genre.id === genreId) return genre.name;
      }
      console.log('no genre', genreId);
      return 'all';
    },
    randomHash: state => (length = 32) => {
      let res = '';
      while (res.length < length) {
        res += Math.random().toString(36).slice(-8);
      }
      return res.slice(-length);
    },
    visibleContents: (state, getters) => {
      let memos = [];
      let contents = state.contents;
      if (state.findQuery !== '') {
        let query = state.findQuery.toUpperCase();
        contents = contents.filter(
            x => x.title.toUpperCase().includes(query) ||
                x.body.toUpperCase().includes(query));
      }
      if (state.currentHow === 'all') {
        if (state.currentGenre === 'all') {
          // 指定なし
          memos = contents.filter(x => x.genre !== 'trash')
                      .groupBy(x => x.how)
                      .map(x => ({
                             name: getters.howName(x.key),
                             memos: x.value,
                             genre: 'all',
                             how: x.key,
                             index: state.hows.findIndex(h => h.id === x.key)
                           }));
          memos.sort((a, b) => a.index - b.index);
        } else {
          // How指定無し
          memos = contents.filter(x => x.genre === state.currentGenre)
                      .groupBy(x => x.how)
                      .map(x => ({
                             name: `${getters.genreName(state.currentGenre)} ${
                                 getters.howName(x.key)}`,
                             memos: x.value,
                             genre: state.currentGenre,
                             how: x.key,
                             index: state.hows.findIndex(h => h.id === x.key)
                           }));
          memos.sort((a, b) => a.index - b.index);
        }
      } else {
        if (state.currentGenre === 'all') {
          // Genre指定なし
          memos = contents.filter(x => x.genre !== 'trash')
                      .filter(x => x.how === state.currentHow)
                      .groupBy(x => x.genre)
                      .map(x => ({
                             name: `${getters.genreName(x.key)} ${
                                 getters.howName(state.currentHow)}`,
                             memos: x.value,
                             genre: x.key,
                             how: state.currentHow,
                             index: state.genres.findIndex(g => g.id === x.key)
                           }));
          memos.sort((a, b) => a.index - b.index);
        } else {
          memos = contents
                      .filter(
                          x =>
                              (state.currentGenre === 'trash' ?
                                   true :
                                   x.genre !== 'trash'))
                      .filter(x => x.how === state.currentHow)
                      .filter(x => x.genre === state.currentGenre);
          let genreName = getters.genreName(state.currentGenre);
          let howName = getters.howName(state.currentHow);
          let name = `${genreName} ${howName}`;
          memos = [{
            name: name,
            memos: memos,
            genre: state.currentGenre,
            how: state.currentHow
          }];
        }
      }
      for (let memo of memos) memo.id = getters.randomHash();
      return memos;
    },
    visibleMemoCount: (state, getters) => {
      return getters.visibleContents.map(x => x.memos.length || 0)
          .reduce((x, y) => x + y, 0);
    }

  },
  mutations: {
    setupSaveData(state) {
      state.saveData.setDefaultData(
          'genres', [{name: '❓', id: 'temporary'}, {ame: '🗑', id: 'trash'}]);
      state.saveData.setDefaultData('hows', [
        {name: 'Todo', id: 'todo'}, {name: 'Later', id: 'later'},
        {name: 'URL', id: 'url'}, {name: 'Study', id: 'study'}
      ]);
      state.saveData.setDefaultData('contents', []);
      state.saveData.autoLoad('genres', state);
      state.saveData.autoLoad('hows', state);
      state.saveData.autoLoad('contents', state);
      state.saveData.ready();
    },
    ...mutation(['currentGenre', 'currentHow', 'findQuery']),
  }
});