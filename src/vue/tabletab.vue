<template lang="pug">
.root
  nav.navbar.navbar-inverse.navbar-fixed-top.top-var
    .navbar-brand.tab.header むらためも
    .navbar-brand.tab.header All
    .navbar-brand.tab(v-for="(tab,i) in hows") {{ tab.name }}
  .under-fixed-top
    .row
      .sidebar.col-sm-3
        ul.nav.nav-pills.nav-stacked
          li.nav-item
            a.nav-link All
          li.nav-item(v-for="(side,i) in genres")
            a.nav-link {{ side.name }}
          li.nav-item
            a.nav-link: i.fas.fa-plus
    .content
      ul.list-group
        li.list-group-item(v-for="(memo,i) in contents")
          memo(:attrs="memo")
      nav.navbar.navbar-fixed-bottom.content
        ul.list-group
          li.list-group-item
            memo(:attrs="{isediting:true}")

</div>
</template>
<script>
// import contents from "../tempdata";
import Memo from "./memo.vue";
import io from "socket.io-client";

module.exports = {
  methods: {
    getRandomHash(length = 32) {
      let res = "";
      while (res.length < length) {
        res += Math.random()
          .toString(36)
          .slice(-8);
      }
      return res.slice(-length);
    },
    updateContent(id, data) {
      this.socket.emit("update-content", {
        genre: this.currentGenre,
        how: this.currentHow,
        id: id,
        content: data
      });
    },
    initFromServer(data) {
      // サーバーデータから全てを強制的に上書き
      this.genres = data.genres;
      this.hows = data.hows;
      let contents = data.contents[this.currentGenre][this.currentHow]; // genre-how-array
      let contentsArray = [];
      for (let id in contents) {
        let content = contents[id];
        content.updateContent = data => {
          this.updateContent(id, data);
        };
        contentsArray.push(content);
      }
      this.contents = contentsArray;
    },
    getSocket() {
      const socket = io(location.origin, { autoConnect: false });
      // socket.on("connect", () => console.log("connect"));
      // socket.on("disconnect", () => console.log("disconnect"));
      socket.on("init", this.initFromServer);
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
  overflow-x: hidden;
  overflow-y: auto;
  text-align: center;
  overflow-wrap: break-word;
  z-index: 10;
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
  padding-top: 1em;
  padding-right: 1em;
  margin-left: @sidebar-size;
}
.tab {
  cursor: pointer;
}
</style>