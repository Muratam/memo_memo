<template lang="pug">
.root
  nav.navbar.navbar-inverse.navbar-fixed-top.top-bar
    //- 上のトップバー
    .navbar-brand.header.clickable(
        @click="getContents(0,0)") memo-memo
    .navbar-brand.header.clickable(
        :class="{ active: currentHow === 0}"
        @click="getContents(null,0)") All
    .navbar-brand.clickable(
        v-for="(tab,i) in hows"
        :class="{ active: currentHow-1 === i}"
        @click="getContents(null,i+1)") {{ tab.name }}

  .under-fixed-top
    .row
      //- 左サイドバー
      .sidebar.col-sm-3
        ul.nav.nav-pills.nav-stacked
          li.nav-item.clickable(
              :class="{ active: currentGenre=== 0}"
              @click="getContents(0,null)")
            a.nav-link All
          li.nav-item.clickable(
              v-for="(side,i) in genres"
              :class="{ active: currentGenre-1 === i}"
              @click="getContents(i+1,null)"
              draggable="true")
            a.nav-link {{ side.name }}
          li.nav-item.clickable
            a.nav-link
              i.fas.fa-plus
    .content.over-fixed-buttom
      //- メインコンテンツ
      ul.list-group(v-if="visibleMemoCount === 0")
        .ul-title No memos...
      ul.list-group(v-for="memoGroup in visibleContents" :key="memoGroup.id")
        //- 統合情報
        .ul-title(v-if="memoGroup.memos.length > 0")
          .clearfix
            span.clickable.name(
                data-toggle="collapse" :data-target="'#'+memoGroup.id"
                ) {{ memoGroup.name }}
            span.num-label.label {{ memoGroup.memos.length }}
            .pull-right
              span.right-icon.clickable(@click="getContents(memoGroup.linkGenre,memoGroup.linkHow)")
                i.fas.fa-arrow-alt-circle-right
        .collapse.in(:id="memoGroup.id")
          li.list-group-item(
              v-for="memo in memoGroup.memos"
              :key="memo.id")
            memo(:attrs="memo" @trush="trushMemo" @update="updateMemo")
      //- 下の投稿ボタン
      nav.navbar.navbar-fixed-bottom.content(v-if="currentHow * currentGenre !== 0")
        ul.list-group
          li.list-group-item
            .input-group.input-group-sm.col-xs-12
              input.form-control(type="text" v-model="commandPallet" @keydown="addMemo")

</div>
</template>
<script>
/*
TODO: 下が出来れば完成してTODO管理をこいつに任せられる！
タブバー:実装を買える必要がある(idベース)
  追加: 一番下のボタン → 薄暗い中に追加ボタンとその説明 →
  削除: 要素が全てなくなると自動で消える
  検索: 一番下のaddButtonが 「+」と「🔎」選べるように(「「+」・「🔎」」を押すと切り替え(モードは分かりやすいように！))
  (入替: 頑張って実装)
  (変更: jsonいじってくれ)

リスト削除をやりやすくする:
  一番上から出来るようにして → 薄暗いなかに確認ボタン(エンターで決定|Escで戻る)

AddButton拡張:
  All状態でも投稿できるようにしたい:
    Genre: All → Temporary
    How  : All → Later
  AddButton が URL なら URLだけにしたい
    How  : All → URL  (そのときだけ)

(herokuにあげる？)
(undo はサーバー側で自動で git add commit するようにする or スタックを実装)
*/

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
    getGenreName(genreId) {
      return this.genres[genreId - 1].name;
    },
    getHowName(howId) {
      return this.hows[howId - 1].name;
    },
    getContents(genre = null, how = null) {
      if (genre !== null) this.currentGenre = genre;
      if (how !== null) this.currentHow = how;
    },
    trushMemo(data) {
      this.updateContent(data.id, null);
    },
    updateMemo(data) {
      this.updateContent(data.id, data);
    },
    addMemo(data) {
      if (window.event.keyCode !== 13) return;
      if ($.trim(this.commandPallet) === "") return;
      data = {
        url: "",
        body: "",
        id: this.getRandomHash(),
        title: this.commandPallet
      };
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
    findIndexById(id) {
      for (let i = 0; i < this.contents.length; i++) {
        const content = this.contents[i];
        if (content.id === id) return i;
      }
      return null;
    },
    updateContent(id, content) {
      let index = this.findIndexById(id);
      if (index === null) {
        // 無ければ末尾に追加
        if (content === null) return;
        if (this.currentGenre === 0) return;
        if (this.currentHow === 0) return;
        if ($.trim(id) === "") content.id = this.getRandomHash();
        content.genre = this.currentGenre;
        content.how = this.currentHow;
        this.contents.push(content);
      } else if (content === null) {
        // 要素を削除
        this.contents.splice(index, 1);
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
      // socket.on("disconnect", () => console.log("disconnect"));
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
      currentGenre: 0,
      currentHow: 0,
      commandPallet: "",
      socket: this.getSocket()
    };
  },
  computed: {
    visibleContents() {
      let memos = [];
      if (this.currentHow === 0) {
        if (this.currentGenre === 0) {
          // 指定なし
          memos = this.contents.groupBy(x => x.how).map(x => ({
            name: this.getHowName(x.key),
            memos: x.value,
            linkGenre: 0,
            linkHow: Number(x.key)
          }));
        } else {
          // How指定無し
          memos = this.contents
            .filter(x => x.genre === this.currentGenre)
            .groupBy(x => x.how)
            .map(x => ({
              name: this.getHowName(x.key),
              memos: x.value,
              linkGenre: this.currentGenre,
              linkHow: Number(x.key)
            }));
        }
      } else {
        if (this.currentGenre === 0) {
          // Genre指定なし
          memos = this.contents
            .filter(x => x.how === this.currentHow)
            .groupBy(x => x.genre)
            .map(x => ({
              name: this.getGenreName(x.key),
              memos: x.value,
              linkGenre: Number(x.key),
              linkHow: this.currentHow
            }));
        } else {
          memos = this.contents
            .filter(x => x.how === this.currentHow)
            .filter(x => x.genre === this.currentGenre);
          let genreName = this.getGenreName(this.currentGenre);
          let howName = this.getHowName(this.currentHow);
          let name = `${genreName} ${howName}`;
          memos = [
            {
              name: name,
              memos: memos,
              linkGenre: this.currentGenre,
              linkHow: this.currentHow
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
  mounted() {
    this.socket.connect();
  },
  components: {
    memo: Memo
  }
};
</script>
<style scoped lang="less">
.under-fixed-top {
  padding-top: 50px;
}
@dark-color: #222;
@accent-color : hsl(208, 40%, 50%);
@accent-color2: hsl(208, 15%, 77%);
@accent-color3: hsl(208, 50%, 70%);
@sidebar-size: 10em;

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
}
.top-bar {
  box-shadow: 0.4em 0.4em 0.4em rgba(0, 0, 0, 0.2);
  .num-label {
    font-size: 0.7em;
    padding-top: 0em;
    margin-top: 0em;
    padding-left: 0.8em;
    color: #777;
    display: none;
  }
}
.content {
  margin-top: 1em;
  margin-right: 1em;
  margin-left: @sidebar-size;
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
.navbar-brand {
  box-shadow: 0 0 0.6em rgba(0, 0, 0, 0.2);
  border-left: 1px solid #444;
  &.active {
    background-color: #558;
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
.clickable {
  cursor: pointer;
}
</style>