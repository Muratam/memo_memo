import {getRandomHash} from '../js/common';
import SaveData from '../js/savedata';
import {toVuex} from '../js/tovue';
class MemoStore {
  constructor() {
    this.genres = [];
    this.hows = [];
    this.contents = [];
    this.currentGenre = 'all';
    this.currentHow = 'all';
    this.findQuery = '';
    this.saveData = new SaveData('webSocket');
    this.blackoutPalletType = '';
  }
  static appendHttp(url) {
    if (url !== '' && !/^https?:\/\//.test(url)) return 'http://' + url;
    return url;
  }
  get howName() {
    return howId => {
      for (let how of this.hows) {
        if (how.id === howId) return how.name;
      }
      console.log('no how', howId);
      return 'all';
    }
  }
  get genreName() {
    return genreId => {
      for (let genre of this.genres) {
        if (genre.id === genreId) return genre.name;
      }
      console.log('no genre', genreId);
      return 'all';
    }
  }
  get visibleContents() {
    let memos = [];
    let contents = this.contents;
    if (this.findQuery !== '') {
      let query = this.findQuery.toUpperCase();
      contents = contents.filter(
          x => x.title.toUpperCase().includes(query) ||
              x.body.toUpperCase().includes(query));
    }
    if (this.currentHow === 'all') {
      if (this.currentGenre === 'all') {
        // 指定なし
        memos = contents.filter(x => x.genre !== 'trash')
                    .groupBy(x => x.how)
                    .map(x => ({
                           name: this.howName(x.key),
                           memos: x.value,
                           genre: 'all',
                           how: x.key,
                           index: this.hows.findIndex(h => h.id === x.key)
                         }));
        memos.sort((a, b) => a.index - b.index);
      } else {
        // How指定無し
        memos = contents.filter(x => x.genre === this.currentGenre)
                    .groupBy(x => x.how)
                    .map(x => ({
                           name: `${this.genreName(this.currentGenre)} ${
                               this.howName(x.key)}`,
                           memos: x.value,
                           genre: this.currentGenre,
                           how: x.key,
                           index: this.hows.findIndex(h => h.id === x.key)
                         }));
        memos.sort((a, b) => a.index - b.index);
      }
    } else {
      if (this.currentGenre === 'all') {
        // Genre指定なし
        memos = contents.filter(x => x.genre !== 'trash')
                    .filter(x => x.how === this.currentHow)
                    .groupBy(x => x.genre)
                    .map(x => ({
                           name: `${this.genreName(x.key)} ${
                               this.howName(this.currentHow)}`,
                           memos: x.value,
                           genre: x.key,
                           how: this.currentHow,
                           index: this.genres.findIndex(g => g.id === x.key)
                         }));
        memos.sort((a, b) => a.index - b.index);
      } else {
        memos =
            contents
                .filter(
                    x =>
                        (this.currentGenre === 'trash' ? true :
                                                         x.genre !== 'trash'))
                .filter(x => x.how === this.currentHow)
                .filter(x => x.genre === this.currentGenre);
        let genreName = this.genreName(this.currentGenre);
        let howName = this.howName(this.currentHow);
        let name = `${genreName} ${howName}`;
        memos = [{
          name: name,
          memos: memos,
          genre: this.currentGenre,
          how: this.currentHow
        }];
      }
    }
    for (let memo of memos) memo.id = getRandomHash();
    return memos;
  }
  get visibleMemoCount() {
    return this.visibleContents.map(x => x.memos.length || 0)
        .reduce((x, y) => x + y, 0);
  }
  startBlackout(type) {
    this.blackoutPalletType = type;
  }
  save(key) {
    this.saveData.save(key, this[key]);
  }
  setupSaveData() {
    this.saveData.setDefaultData(
        'genres', [{name: '❓', id: 'temporary'}, {ame: '🗑', id: 'trash'}]);
    this.saveData.setDefaultData('hows', [
      {name: 'Todo', id: 'todo'}, {name: 'Later', id: 'later'},
      {name: 'URL', id: 'url'}, {name: 'Study', id: 'study'}
    ]);
    this.saveData.setDefaultData('contents', []);
    this.saveData.autoLoad('genres', this);
    this.saveData.autoLoad('hows', this);
    this.saveData.autoLoad('contents', this);
    this.saveData.ready();
  }
  deleteContent(id) {
    let index = this.contents.findIndex(x => x.id === id);
    if (index === -1) return;
    let content = this.contents[index];
    if (content.genre === 'trash' ||
        (content.url === '' && content.title === '' && content.body === '')) {
      // 要素を削除
      this.contents.splice(index, 1);
    } else {
      // 要素をゴミ箱へ
      content.genre = 'trash';
      this.contents.splice(index, 1, content);
    }
    // WARN:
    this.save('contents');
    // WARN:
    this.checkDeletedGenres();
  }
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
    // WARN:
    this.save('genres');
  }
  addContent(content) {
    if (content === null) return;
    content.url = MemoStore.appendHttp(content.url);
    if ($.trim(content.id) === '') content.id = getRandomHash();
    if (!('how' in content)) content.how = this.currentHow;
    if (!('genre' in content)) content.genre = this.currentGenre;
    if (content.how === 'all') content.how = 'later';
    if (content.genre === 'all') content.genre = 'temporary';
    this.contents.push(content);
    // WARN:
    this.save('contents');
  }
  updateContent(content) {
    let index = this.contents.findIndex(x => x.id === content.id);
    if (index === -1) return;
    content.url = MemoStore.appendHttp(content.url);
    if (!content.genre) content.genre = this.contents[index].genre;
    if (!content.how) content.how = this.contents[index].how;
    this.contents.splice(index, 1, content);
    // WARN:
    this.save('contents');
  }
  // 外から代入可能に
  set $$currentGenre(_) {}
  set $$currentHow(_) {}
  set $$findQuery(_) {}
  set $$genres(_) {}
  set $$blackoutPalletType(_) {}
}
export default toVuex(MemoStore);
