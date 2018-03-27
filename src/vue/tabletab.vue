<template lang="pug">
.root
  //- 上のトップバー
  nav.navbar.navbar-inverse.navbar-fixed-top.top-bar
    .navbar-brand.header.clickable(
        @click="getContents('all','all')") memo-memo
    .navbar-brand.header.clickable(
        :class="{ active: currentHow === 'all'}"
        @click="getContents(null,'all')") All
    .navbar-brand.clickable(
        v-for="(tab,i) in hows"
        :class="{ active: currentHow === tab.id}"
        :key="tab.id"
        @click="getContents(null,tab.id)") {{ tab.name }}
    .navbar-brand.col-xs-2.pull-right.findbox
      .input-group.input-group-sm.has-feedback
        input.form-control.commandpallet(
            type="text" v-model="findQuery"
            @keydown="addMemo"
            id="commandPallet")
        span.input-group-addon.pallet-addon.form-control-feedback.feedbackicon
          i.fas.fa-search.pallet-icon

  .under-fixed-top
    //- 左サイドバー
    .row
      .sidebar.col-sm-3
        ul.nav.nav-pills.nav-stacked
          li.nav-item.clickable(
              :class="{ active: currentGenre ===  'all'}"
              @click="getContents('all',null)")
            a.nav-link All
          li.nav-item.clickable(
              v-for="(side,i) in genres"
              :class="{ active: currentGenre === side.id}"
              @click="getContents(side.id,null)"
              :key="side.id"
              draggable="true")
            a.nav-link {{ side.name }}
          li.nav-item.clickable(@click="startBlackout('addGenre')")
            a.nav-link
              i.fas.fa-plus
    //- メインコンテンツ
    .content.over-fixed-buttom
      //- 何も無い時
      ul.list-group(v-if="visibleMemoCount === 0")
        .ul-title No memos...
      //- 各リストグループ
      ul.list-group(v-for="memoGroup in visibleContents" :key="memoGroup.id")
        //- グループ情報
        .ul-title(v-if="memoGroup.memos.length > 0")
          .clearfix
            span.clickable.name(
                data-toggle="collapse" :data-target="'#'+memoGroup.id"
                ) {{ memoGroup.name }}
            span.num-label.label {{ memoGroup.memos.length }}
            .pull-right
              span.right-icon.clickable(@click="getContents(memoGroup.genre,memoGroup.how)")
                i.fas.fa-arrow-alt-circle-right
        //- 各リスト
        .collapse.in(:id="memoGroup.id")
          li.list-group-item(
              v-for="memo in memoGroup.memos"
              :key="memo.id")
            memo(:attrs="memo" @trash="trashMemo" @update="updateMemo")
    //- 下のコマンドパレット
    nav.navbar.navbar-fixed-bottom.content
      ul.list-group.pallet
        li.list-group-item
          .input-group.input-group-sm.col-xs-12.has-feedback
            input.form-control.commandpallet(
                type="text" v-model="commandPallet"
                @keydown="addMemo" autofocus
                id="commandPallet")
            span.input-group-addon.pallet-addon.form-control-feedback.feedbackicon
              i.fas.fa-plus.pallet-icon
  //- 暗転コマンドパレット
  .fadelayer(v-if="blackoutPalletType !== ''")
    .blackout(@click="escapeBlackout")
    ul.list-group.pallet
      li.list-group-item
        .blackout-comment {{ blackoutPalletType }}
        .input-group.input-group-lg
          span.input-group-addon.pallet-addon
            i.clickable.fas.fa-search.pallet-icon(v-if="blackoutPalletType === 'find'")
            i.clickable.fas.fa-plus.pallet-icon(v-if="blackoutPalletType === 'addGenre'")
          input.form-control.commandpallet(
              type="text" v-model="blackoutPallet"
              @keydown="decidedAtBlackout" id="blackoutPallet")

</div>
</template>
<script>
import Memo from "./memo.vue";
import io from "socket.io-client";
Array.prototype.groupBy = function(keyFunc) {
  let res = {};
  this.forEach(c => {
    let key = keyFunc(c);
    if (key in res) res[key].push(c);
    else res[key] = [c];
  });
  // WARN: 暗黙の型変換が入るので注意！！
  return Object.keys(res).map(k => ({ key: k, value: res[k] }));
};

module.exports = {
  methods: {
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
      this.socket.emit("update-genres", this.genres);
      let content = this.makeEmptyContent(genreId, this.currentHow);
      this.updateContent(content.id, content);
      this.currentGenre = genreId;
    },
    getGenreName(genreId) {
      for (let genre of this.genres) {
        if (genre.id === genreId) return genre.name;
      }
      console.log("no genre", genreId);
      return "all";
    },
    getHowName(howId) {
      for (let how of this.hows) {
        if (how.id === howId) return how.name;
      }
      console.log("no how", howId);
      return "all";
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
    getRandomHash(length = 32) {
      let res = "";
      while (res.length < length) {
        res += Math.random()
          .toString(36)
          .slice(-8);
      }
      return res.slice(-length);
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
      this.socket.emit("update-genres", this.genres);
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
        content.genre = this.contents[index].genre;
        content.how = this.contents[index].how;
        this.contents.splice(index, 1, content);
      }
      this.socket.emit("update-contents", this.contents);
    },
    getSocket() {
      const socket = io(location.origin, { autoConnect: false });
      // socket.on("connect", () => console.log("connect"));
      socket.on("disconnect", () => {
        alert("disconnected...");
      });
      // genres/hows/contents更新
      socket.on("init", data => {
        this.genres = data.genres;
        this.hows = data.hows;
        this.contents = data.contents;
      });
      // contents更新
      socket.on("set-contents", contents => {
        this.contents = contents;
      });
      return socket;
    }
  },
  data() {
    return {
      genres: [],
      hows: [],
      contents: [],
      currentGenre: "all",
      currentHow: "all",
      commandPallet: "",
      blackoutPallet: "",
      findQuery: "",
      blackoutPalletType: "", // addGenre / ""
      socket: this.getSocket()
    };
  },
  computed: {
    visibleContents() {
      let memos = [];
      let contents = this.contents;
      if (this.findQuery !== "") {
        let query = this.findQuery.toUpperCase();
        contents = contents.filter(
          x =>
            x.title.toUpperCase().includes(query) ||
            x.body.toUpperCase().includes(query)
        );
      }
      if (this.currentHow === "all") {
        if (this.currentGenre === "all") {
          // 指定なし
          memos = contents
            .filter(x => x.genre !== "trash")
            .groupBy(x => x.how)
            .map(x => ({
              name: this.getHowName(x.key),
              memos: x.value,
              genre: "all",
              how: x.key,
              index: this.hows.findIndex(h => h.id === x.key)
            }));
          memos.sort((a, b) => a.index - b.index);
        } else {
          // How指定無し
          memos = contents
            .filter(x => x.genre === this.currentGenre)
            .groupBy(x => x.how)
            .map(x => ({
              name: `${this.getGenreName(this.currentGenre)} ${this.getHowName(
                x.key
              )}`,
              memos: x.value,
              genre: this.currentGenre,
              how: x.key,
              index: this.hows.findIndex(h => h.id === x.key)
            }));
          memos.sort((a, b) => a.index - b.index);
        }
      } else {
        if (this.currentGenre === "all") {
          // Genre指定なし
          memos = contents
            .filter(x => x.genre !== "trash")
            .filter(x => x.how === this.currentHow)
            .groupBy(x => x.genre)
            .map(x => ({
              name: `${this.getGenreName(x.key)} ${this.getHowName(
                this.currentHow
              )}`,
              memos: x.value,
              genre: x.key,
              how: this.currentHow,
              index: this.genres.findIndex(g => g.id === x.key)
            }));
          memos.sort((a, b) => a.index - b.index);
        } else {
          memos = contents
            .filter(
              x => (this.currentGenre === "trash" ? true : x.genre !== "trash")
            )
            .filter(x => x.how === this.currentHow)
            .filter(x => x.genre === this.currentGenre);
          let genreName = this.getGenreName(this.currentGenre);
          let howName = this.getHowName(this.currentHow);
          let name = `${genreName} ${howName}`;
          memos = [
            {
              name: name,
              memos: memos,
              genre: this.currentGenre,
              how: this.currentHow
            }
          ];
        }
      }
      for (let memo of memos) memo.id = this.getRandomHash();
      return memos;
    },
    visibleMemoCount() {
      return this.visibleContents
        .map(x => x.memos.length || 0)
        .reduce((x, y) => x + y, 0);
    }
  },
  watch: {
    blackoutPalletType() {
      this.$nextTick(() => {
        if (this.blackoutPalletType !== "") $("#blackoutPallet").focus();
        else $("#commandPallet").focus();
      });
    }
  },
  mounted() {
    this.socket.connect();
    // esc:27
    $(document).keydown(e => {
      if (e.keyCode === 27) this.escapeBlackout();
    });
  },
  components: {
    memo: Memo
  }
};
</script>
<style scoped lang="less">
@dark-color: #222;
@accent-color : hsl(208, 40%, 50%);
@accent-color2: hsl(208, 15%, 77%);
@accent-color3: hsl(208, 50%, 70%);
@sidebar-size: 10em;
.under-fixed-top {
  padding-top: 50px;
}
.over-fixed-buttom {
  margin-bottom: 50vh;
}
.clickable {
  cursor: pointer;
}

.sidebar {
  transition: all 0.3s;
  padding: 0em;
  width: @sidebar-size;
  height: 100%;
  padding-left: 1em;
  position: fixed;
  text-align: center;
  // overflow-wrap: break-word;
  // overflow-x: hidden;
  overflow-y: auto;
  // z-index: 10;
  // opacity: 0.75;
  background: @accent-color2 + #333;
  box-shadow: 0.1em 0 0.2em rgba(0, 0, 0, 0.2);
  &::-webkit-scrollbar {
    display: none;
  }
}
.top-bar {
  .navbar-brand {
    box-shadow: 0 0 0.6em rgba(0, 0, 0, 0.2);
    border-left: 1px solid #444;
    &.active {
      background-color: #558;
    }
  }
  box-shadow: 0.4em 0.4em 0.4em rgba(0, 0, 0, 0.2);
  .findbox {
    // margin: 0em;
    padding-top: 0.6em;
    padding-bottom: 0.3em;
    input {
      background: #111;
      color: #666;
      border-color: #00000000;
    }
    span {
      background: #111;
      color: #666;
      border-color: #00000000;
    }
  }
}
.feedbackicon {
  padding-right: 1.5em;
}
.content {
  margin-top: 1em;
  width: auto;
  margin-left: @sidebar-size;
  margin-right: 0.8em;
  .ul-title {
    font-size: 1.2em;
    padding: 0.35em 0.4em 0.4em 0.8em;
    background: @accent-color3;
    color: #fff;
    .num-label {
      margin-left: 0.5em;
      margin-right: 0.5em;
      font-size: 0.8em;
      margin-top: 1em;
      padding-top: 0em;
      padding-bottom: 0em;
      background-color: @accent-color3 + #111;
      color: @accent-color3 + #444;
    }
    .right-icon {
      margin: 0em 0.3em 0em 0.3em;
      color: #ddf;
      &:hover {
        color: #eef;
      }
    }
    .name {
      padding: 0.3em 0.5em 0.4em 0em;
      // background: #fff;
    }
  }
  .list-group {
    box-shadow: 0 0 0.6em rgba(0, 0, 0, 0.2);
  }
  .list-group-item {
    color: #333;
    padding: 0.3em;
  }
}
.navbar-fixed-bottom {
  margin-bottom: 0em;
  padding-bottom: 0em;
  ul {
    margin-bottom: 0em;
    padding-bottom: 0em;
  }
}
.pallet {
  .pallet-back {
    font-size: 1.5em;
    margin: 0;
    margin-right: 0.4em;
    padding: 0;
    .pallet-icon {
      margin-left: 1em;
    }
  }
  .pallet-addon {
    background-color: #fff;
  }
  .commandpallet {
    overflow: auto;
  }
  li {
    background-color: #00000000;
    border-color: #00000000;
  }
}
.fadelayer {
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 10000;
  .blackout {
    background-color: #000;
    opacity: 0.5;
    width: 100vw;
    height: 100vh;
    // visibility: hidden;
  }
  ul {
    position: fixed;
    top: 40%;
    left: 0px;
    width: 100vw;
    height: 100vh;
  }
  ul {
    padding-right: 1em;
    margin-right: 1em;
  }
  li {
    background-color: #00000000;
    border-color: #00000000;
    margin-left: @sidebar-size;
    margin-right: 2em;
  }
  .blackout-comment {
    font-size: 3em;
    color: #eeeeee;
  }
}
</style>