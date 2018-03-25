<template lang="pug">
.root
  nav.navbar.navbar-inverse.navbar-fixed-top.top-var
    .navbar-brand.header むらためも
    .navbar-brand.header All
    .navbar-brand(v-for="(tab,i) in hows"
                      :class="{ active: currentHow-1 === i}") {{ tab.name }}
  .under-fixed-top
    .row
      .sidebar.col-sm-3
        ul.nav.nav-pills.nav-stacked
          li.nav-item
            a.nav-link All
          li.nav-item(v-for="(side,i) in genres"
                      :class="{ active: currentGenre-1 === i}")
            a.nav-link {{ side.name }}
          li.nav-item
            a.nav-link: i.fas.fa-plus
    .content
      ul.list-group
        li.list-group-item(v-for="memo in contents")
          memo(:attrs="memo" @trush="trushMemo" @update="updateMemo")
      ul.list-group
        li.list-group-item
          memo(:attrs="{isediting: true,alwaysEditState: true}"
               @update="addMemo")
      //- nav.navbar.navbar-fixed-bottom.content

</div>
</template>
<script>
// import contents from "../tempdata";
import Memo from "./memo.vue";
import io from "socket.io-client";

module.exports = {
  methods: {
    // 上手く行く（強引に…）
    adjustContents() {
      setTimeout(() => {
        let tmp = this.contents;
        this.contents = [];
        setTimeout(() => (this.contents = tmp), 0);
      }, 0);
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
      } else if (content == null) {
        // 要素を削除
        this.contents.splice(index, 1);
        this.adjustContents();
      } else {
        // 普通に更新
        this.contents.splice(index, 1, content);
      }
      return this.socket.emit("update-contents", {
        genre: this.currentGenre,
        how: this.currentHow,
        contents: this.contents
      });
    },
    initFromServer(data) {
      // サーバーデータから全てを強制的に上書き
      this.genres = data.genres;
      this.hows = data.hows;
      this.contents = data.contents[this.currentGenre][this.currentHow]; // genre-how-array
    },
    getSocket() {
      const socket = io(location.origin, { autoConnect: false });
      // socket.on("connect", () => console.log("connect"));
      // socket.on("disconnect", () => console.log("disconnect"));
      socket.on("init", data => {
        this.initFromServer(data);
      });
      return socket;
    }
  },
  data() {
    return {
      genres: [],
      hows: [],
      contents: [],
      currentGenre: 4,
      currentHow: 4,
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
  li {
    cursor: pointer;
  }
}
.content {
  margin-top: 1em;
  margin-right: 1em;
  margin-left: @sidebar-size;
}
.tab {
  cursor: pointer;
}
</style>