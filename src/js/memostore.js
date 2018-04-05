import Vue from 'vue/dist/vue.esm.js';
import Vuex from 'vuex';

import {bindStateToThisAtMutation, getRandomHash, mutationByAssign, mutations} from '../js/common'
import SaveData from '../js/savedata';
Vue.use(Vuex);

// WARN:
function appendHttp(url) {
  if (url !== '' && !/^https?:\/\//.test(url)) return 'http://' + url;
  return url;
}
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
    ...bindStateToThisAtMutation({
      startBlackout(type) {
        this.blackoutPalletType = type;
      },
      save(key) {
        this.saveData.save(key, this[key]);
      },
      setupSaveData() {
        this.saveData.setDefaultData(
            'genres',
            [{name: '❓', id: 'temporary'}, {ame: '🗑', id: 'trash'}]);
        this.saveData.setDefaultData('hows', [
          {name: 'Todo', id: 'todo'}, {name: 'Later', id: 'later'},
          {name: 'URL', id: 'url'}, {name: 'Study', id: 'study'}
        ]);
        this.saveData.setDefaultData('contents', []);
        this.saveData.autoLoad('genres', this);
        this.saveData.autoLoad('hows', this);
        this.saveData.autoLoad('contents', this);
        this.saveData.ready();
      },
      deleteContent(id) {
        let index = this.contents.findIndex(x => x.id === id);
        if (index === -1) return;
        let content = this.contents[index];
        if (content.genre === 'trash' ||
            (content.url === '' && content.title === '' &&
             content.body === '')) {
          // 要素を削除
          this.contents.splice(index, 1);
        } else {
          // 要素をゴミ箱へ
          content.genre = 'trash';
          this.contents.splice(index, 1, content);
        }
        mutations(this).save('contents');
        mutations(this).checkDeletedGenres();
      },
      checkDeletedGenres() {
        let genreIds = this.contents.groupBy(x => x.genre).map(x => x.key);
        genreIds.push('trash');
        genreIds.push('temporary');
        let newGenres = [];
        let updated = false;
        for (let genre of this.genres) {
          let ok = genreIds.some(x => x === genre.id);
          if (ok)
            newGenres.push(genre);
          else
            updated = true;
        }
        if (!updated) return;
        this.genres = newGenres;
        this.currentGenre = 'all';
        mutations(this).save('genres');
      },
      addContent(content) {
        if (content === null) return;
        content.url = appendHttp(content.url);
        if ($.trim(content.id) === '') content.id = getRandomHash();
        if (!('how' in content)) content.how = this.currentHow;
        if (!('genre' in content)) content.genre = this.currentGenre;
        if (content.how === 'all') content.how = 'later';
        if (content.genre === 'all') content.genre = 'temporary';
        this.contents.push(content);
        mutations(this).save('contents');
      },
      updateContent(id, content) {
        let index = this.contents.findIndex(x => x.id === id);
        if (index === -1) return;
        content.url = appendHttp(content.url);
        if (!content.genre) content.genre = this.contents[index].genre;
        if (!content.how) content.how = this.contents[index].how;
        this.contents.splice(index, 1, content);
        mutations(this).save('contents');
      },
    }),
    // 更新が自動で反映される
    ...mutationByAssign(['currentGenre', 'currentHow', 'findQuery']),
  },
});