import Vue from 'vue/dist/vue.esm.js';
import Vuex from 'vuex';

import {getRandomHash, mutationByAssign, mutations} from '../js/common'
import SaveData from '../js/savedata';

Vue.use(Vuex);

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
      for (let memo of memos) memo.id = getRandomHash();
      return memos;
    },
    visibleMemoCount: (state, getters) => {
      return getters.visibleContents.map(x => x.memos.length || 0)
          .reduce((x, y) => x + y, 0);
    }

  },
  mutations: {
    setupSaveData: state => {
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
    save: (state, key) => {
      state.saveData.save(key, state[key]);
    },
    startBlackout: (state, type) => {
      state.blackoutPalletType = type;
    },
    deleteContent(state, id) {
      let index = state.contents.findIndex(x => x.id === id);
      if (index === -1) return;
      let content = state.contents[index];
      if (content.genre === 'trash' ||
          (content.url === '' && content.title === '' && content.body === '')) {
        // 要素を削除
        state.contents.splice(index, 1);
      } else {
        // 要素をゴミ箱へ
        content.genre = 'trash';
        state.contents.splice(index, 1, content);
      }
      mutations(this).checkDeletedGenres();
    },
    updateContent(id, content) {
      /* TODO:
      let index = this.contents.findIndex(x => x.id === id);
      // url に http を付与
      if (
        content !== null &&
        content.url !== "" &&
        !/^https?:\/\//.test(content.url)
      ) {
        content.url = "http://" + content.url;
      }
      if (index === -1) {
        // 無ければ末尾に追加
        if (content === null) return;
        if ($.trim(id) === "") content.id = this.getRandomHash();
        if (!("how" in content)) content.how = this.currentHow;
        if (!("genre" in content)) content.genre = this.currentGenre;
        // WARN: 強引にAllを変換
        if (content.how === "all") content.how = "later";
        if (content.genre === "all") content.genre = "temporary";
        this.contents.push(content);
      } else if (content === null) {
        content = this.contents[index];
        if (
          content.genre === "trash" ||
          (content.url === "" && content.title === "" && content.body === "")
        ) {
          // 要素を削除
          this.contents.splice(index, 1);
        } else {
          // 要素をゴミ箱へ
          content.genre = "trash";
          this.contents.splice(index, 1, content);
        }
        this.checkDeletedGenres();
      } else {
        // 普通に更新
        if (!content.genre) content.genre = this.contents[index].genre;
        if (!content.how) content.how = this.contents[index].how;
        this.contents.splice(index, 1, content);
      }
      this.saveData.save("contents", this.contents);
      */
    },
    checkDeletedGenres: state => {
      console.log('checkDelete');
      let genreIds = state.contents.groupBy(x => x.genre).map(x => x.key);
      genreIds.push('trash');
      genreIds.push('temporary');
      let newGenres = [];
      let updated = false;
      for (let genre of state.genres) {
        let ok = genreIds.some(x => x === genre.id);
        if (ok)
          newGenres.push(genre);
        else
          updated = true;
      }
      if (!updated) return;
      state.genres = newGenres;
      state.currentGenre = 'all';
      state.saveData.save('genres', state.genres);
    },

    // 更新が自動で反映される
    ...mutationByAssign(['currentGenre', 'currentHow', 'findQuery']),
  },
});