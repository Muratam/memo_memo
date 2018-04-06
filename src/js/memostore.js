import sampleData from '../../server/sampledata/howto.json';
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
    // this.saveData = new SaveData('localStorage');
    this.saveData = new SaveData('webSocket');
    this.blackoutPalletType = '';
  }
  static get defaultData() {
    return sampleData;
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
          x => (x.title || '').toUpperCase().includes(query) ||
              (x.body || '').toUpperCase().includes(query) ||
              (x.url || '').toUpperCase().includes(query));
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
  setupSaveData() {
    let defaultData = MemoStore.defaultData;
    this.saveData.setDefaultData('genres', defaultData.genres);
    this.saveData.setDefaultData('hows', defaultData.hows);
    this.saveData.setDefaultData('contents', defaultData.contents);
    this.saveData.autoLoad('genres', this);
    this.saveData.autoLoad('hows', this);
    this.saveData.autoLoad('contents', this);
    this.saveData.ready();
  }
  startBlackout(type) {
    this.blackoutPalletType = type;
  }
  save(key) {
    this.saveData.save(key, this[key]);
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
    this.save('contents');
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
    this.save('genres');
  }
  static makeEmptyContent(genre, how) {
    return {
      url: '',
      title: '',
      body: '',
      id: getRandomHash(),
      genre: genre,
      how: how
    };
  }
  addGenre(genreName) {
    let genreId = getRandomHash();
    this.genres.push({name: genreName, id: genreId});
    this.save('genres');
    this.currentGenre = genreId;
    let content = MemoStore.makeEmptyContent(genreId, this.currentHow);
    this.addContent(content);
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
    this.save('contents');
  }
  updateContent(content) {
    let index = this.contents.findIndex(x => x.id === content.id);
    if (index === -1) return;
    content.url = MemoStore.appendHttp(content.url);
    if (!content.genre) content.genre = this.contents[index].genre;
    if (!content.how) content.how = this.contents[index].how;
    this.contents.splice(index, 1, content);
    this.save('contents');
    this.checkDeletedGenres();
  }
  swapContent(id1, id2) {
    let dataAIndex = this.contents.findIndex(x => x.id === id1);
    if (dataAIndex === -1) return;
    let dataBIndex = this.contents.findIndex(x => x.id === id2);
    if (dataBIndex === -1) return;
    if (dataAIndex === dataBIndex) return;
    let dataA = this.contents[dataAIndex];
    let dataB = this.contents[dataBIndex];
    if (dataA.genre === dataB.genre && dataA.how === dataB.how) {
      // 順番入れ替え
      this.contents.splice(dataAIndex, 1, dataB);
      this.contents.splice(dataBIndex, 1, dataA);
    } else {
      // dataA をdataBの下に追加
      dataA.genre = dataB.genre;
      dataA.how = dataB.how;
      this.contents.splice(dataAIndex, 1, dataA);
    }
    this.save('contents');
    this.checkDeletedGenres();
  }
  changeGenreHowOfContent(id, how, genre) {
    let index = this.contents.findIndex(x => x.id === id);
    if (index === -1) return;
    let savedData = this.contents[index];
    savedData.genre = genre ? genre : savedData.genre;
    savedData.how = how ? how : savedData.how;
    this.contents.splice(index, 1, savedData);
    this.save('contents');
    this.checkDeletedGenres();
  }
  swapGenre(id1, id2) {
    let aIndex = this.genres.findIndex(x => x.id == id1);
    let bIndex = this.genres.findIndex(x => x.id == id2);
    if (aIndex === -1 || bIndex === -1) return;
    if (aIndex === bIndex) return;
    // 入れ替えは直感的ではないのでAを削除してBの下に追加で
    let aGenre = this.genres[aIndex];
    this.genres.splice(aIndex, 1);
    bIndex = this.genres.findIndex(x => x.id == id2);
    this.genres.splice(bIndex, 0, aGenre);
    this.save('genres');
  }
  renameGenre(id, name) {
    let index = this.genres.findIndex(x => x.id === id);
    if (index === -1) return;
    let genre = this.genres[index];
    genre.name = name;
    this.contents.splice(index, 1, genre);
    this.save('genres');
  }
  // 外から代入可能に
  set $$currentGenre(_) {}
  set $$currentHow(_) {}
  set $$findQuery(_) {}
  set $$genres(_) {}
  set $$blackoutPalletType(_) {}
}
export default toVuex(MemoStore);
