<template lang="pug">
.root
  topbar
  .under-fixed-top
    //- sidebar
    //- contents
    //- bottompallet
  //- blackoutpallet

</div>
</template>
<script>
import TopBar from "./topbar";
module.exports = {
  mounted() {
    this.$store.commit("setupSaveData");
  },
  components: {
    topbar: TopBar
  }
};
/*
import Memo from "./memo.vue";
module.exports = {
  methods: {
    sidebarClick(event, sideId) {
      if (this.currentGenre !== sideId) return this.getContents(sideId, null);
      // rename
    },
    submitRenameGenre(event, sideId) {
      console.log(event.target, sideId);
    },
    sidebarDrop(event, sideId) {
      event.preventDefault();
      event.target.classList.remove("dropping");
      let transferSideId = event.dataTransfer.getData("sideid");
      if (transferSideId === "") return this.dropUpdate(event, null, sideId);
      let aIndex = this.genres.findIndex(x => x.id == transferSideId);
      let bIndex = this.genres.findIndex(x => x.id == sideId);
      if (aIndex === -1 || bIndex === -1) return;
      if (aIndex === bIndex) return;
      // 入れ替えは直感的ではないのでAを削除してBの下に追加で
      let aGenre = this.genres[aIndex];
      this.genres.splice(aIndex, 1);
      bIndex = this.genres.findIndex(x => x.id == sideId);
      this.genres.splice(bIndex, 0, aGenre);
      this.saveData.save("genres", this.genres);
    },
    dropUpdate(event, how, genre) {
      event.preventDefault();
      event.target.classList.remove("dropping");
      let data = event.dataTransfer.getData("memo");
      if (data === "") return;
      data = JSON.parse(data);
      let savedData = this.contents.find(x => x.id === data.id);
      if (!savedData) return;
      data.genre = genre ? genre : savedData.genre;
      data.how = how ? how : savedData.how;
      this.updateContent(data.id, data);
    },
    swapContent(event, memoid) {
      event.preventDefault();
      event.target.classList.remove("dropping");
      let data = event.dataTransfer.getData("memo");
      if (!data) return;
      data = JSON.parse(data);
      let dataAIndex = this.contents.findIndex(x => x.id === data.id);
      if (dataAIndex === -1) return;
      let dataBIndex = this.contents.findIndex(x => x.id === memoid);
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
      this.saveData.save("contents", this.contents);
    },
    startBlackout(type) {
      this.blackoutPalletType = type;
    },
    escapeBlackout() {
      this.blackoutPallet = "";
      this.blackoutPalletType = "";
    },
    decidedAtBlackout() {
      if (!this.isDecided()) return;
      switch (this.blackoutPalletType) {
        case "addGenre":
          this.addGenre(this.blackoutPallet);
          break;
        default:
          break;
      }
      this.blackoutPallet = "";
      this.blackoutPalletType = "";
    },
    makeEmptyContent(genre, how) {
      return {
        url: "",
        title: "",
        id: this.getRandomHash(),
        body: "",
        genre: genre,
        how: how
      };
    },
    addGenre(genreName) {
      let genreId = this.getRandomHash();
      this.genres.push({ name: genreName, id: genreId });
      this.saveData.save("genres", this.genres);
      let content = this.makeEmptyContent(genreId, this.currentHow);
      this.updateContent(content.id, content);
      this.currentGenre = genreId;
    },
    getContents(genre = null, how = null) {
      if (genre !== null) this.currentGenre = genre;
      if (how !== null) this.currentHow = how;
    },
    trashMemo(data) {
      this.updateContent(data.id, null);
    },
    updateMemo(data) {
      this.updateContent(data.id, data);
    },
    isDecided() {
      return window.event.keyCode === 13;
    },
    addMemo(data) {
      if (!this.isDecided()) return;
      let title = $.trim(this.commandPallet);
      if (title === "") return;
      data = {
        url: "",
        body: "",
        id: this.getRandomHash(),
        title: ""
      };
      if (/^https?:\/\//.test(title)) {
        data.url = data.title = title;
        if (this.currentHow === "all") data.how = "url";
      } else data.title = title;
      this.updateContent(data.id, data);
      this.commandPallet = "";
    },
    checkDeletedGenres() {
      let genreIds = this.contents.groupBy(x => x.genre).map(x => x.key);
      genreIds.push("trash");
      genreIds.push("temporary");
      let newGenres = [];
      let updated = false;
      for (let genre of this.genres) {
        let ok = genreIds.some(x => x === genre.id);
        if (ok) newGenres.push(genre);
        else updated = true;
      }
      if (!updated) return;
      this.genres = newGenres;
      this.currentGenre = "all";
      this.saveData.save("genres", this.genres);
    },
    updateContent(id, content) {
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
    }
  },
  mounted() {
    $(document).keydown(e => {
      // esc:27
      if (e.keyCode === 27) this.escapeBlackout();
    });
  }
};
*/
</script>
<style scoped lang="less">
@import "../css/common.less";
</style>