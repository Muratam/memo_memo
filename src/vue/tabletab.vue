<template lang="pug">
.root
  nav.navbar.navbar-inverse.navbar-fixed-top.top-bar
    .navbar-brand.header.clickable(
        @click="getContents(0,0)") むらためも
    .navbar-brand.header.clickable(
        :class="{ active: currentHow === 0}"
        @click="getContents(null,0)") All
      .num-label.pull-right 20
    .navbar-brand.clickable(
        v-for="(tab,i) in hows"
        :class="{ active: currentHow-1 === i}"
        @click="getContents(null,i+1)") {{ tab.name }}
      .num-label.pull-right 5

  .under-fixed-top
    .row
      .sidebar.col-sm-3
        ul.nav.nav-pills.nav-stacked
          li.nav-item.clickable(
              :class="{ active: currentGenre=== 0}"
              @click="getContents(0,null)")
            a.nav-link All
              .num-label.pull-right 20
          li.nav-item.clickable(
              v-for="(side,i) in genres"
              :class="{ active: currentGenre-1 === i}"
              @click="getContents(i+1,null)")
            a.nav-link {{ side.name }}
              .num-label.pull-right 20
          li.nav-item.clickable
            a.nav-link
              i.fas.fa-plus
              .num-label.pull-right 20
    .content.over-fixed-buttom
      ul.list-group
        .ul-title(v-if="contents.length > 0")
          | {{ currentGenre === 0 ? "" : genres[currentGenre-1].name }}
          | {{ currentHow === 0 ? "" : hows[currentHow-1].name }}
          | {{ currentHow + currentGenre === 0 ? "All": ""}}
        .ul-title(v-if="contents.length === 0") Nothing
        li.list-group-item(v-for="memo in contents" :key="memo.id")
          memo(:attrs="memo" @trush="trushMemo" @update="updateMemo")
      nav.navbar.navbar-fixed-bottom.content(v-if="currentHow * currentGenre !== 0")
        ul.list-group
          li.list-group-item
            memo(:attrs="{isediting: true,isAddButton: true}"
                  @update="addMemo")

</div>
</template>
<script>
// import contents from "../tempdata";
import Memo from "./memo.vue";
import io from "socket.io-client";

module.exports = {
  methods: {
    getContents(genre = null, how = null) {
      if (genre !== null) this.currentGenre = genre;
      if (how !== null) this.currentHow = how;
      this.socket.emit("get-contents", {
        genre: this.currentGenre,
        how: this.currentHow
      });
    },
    trushMemo(data) {
      this.updateContent(data.id, null);
    },
    updateMemo(data) {
      this.updateContent(data.id, data);
    },
    addMemo(data) {
      this.updateContent(data.id, data);
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
        if (content === null) return;
        // 無ければ末尾に追加
        if (id === "") content.id = this.getRandomHash();
        this.contents.push(content);
      } else if (content === null) {
        // 要素を削除
        this.contents.splice(index, 1);
      } else {
        // 普通に更新
        this.contents.splice(index, 1, content);
      }
      this.socket.emit("update-contents", {
        genre: this.currentGenre,
        how: this.currentHow,
        contents: this.contents
      });
    },
    getSocket() {
      const socket = io(location.origin, { autoConnect: false });
      // socket.on("connect", () => console.log("connect"));
      // socket.on("disconnect", () => console.log("disconnect"));
      // サーバーデータから全てを強制的に上書き
      socket.on("init", data => {
        this.genres = data.genres;
        this.hows = data.hows;
        this.getContents(this.currentGenre, this.currentHow);
      });
      // genre・howを指定して更新
      socket.on("set-contents", data => {
        let { genre, how, contents } = data;
        if (genre !== this.currentGenre || how !== this.currentHow) return;
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
      socket: this.getSocket()
    };
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
  // overflow-y: auto;
  // z-index: 10;
  background: @accent-color2 + #333;
  // border-right: 1px solid @accent-color3;
  // color: @accent-color2;
  // &.active {margin-left: -@sidebar-size;}
  // opacity: 0.75;
  box-shadow: 0.1em 0 0.2em rgba(0, 0, 0, 0.2);
  .num-label {
    font-size: 0.8em;
    color: #ccc;
    display: none;
  }
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
    padding: 0.4em 0.4em 0.4em 0.8em;
    background: @accent-color3;
    color: #fff;
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