<template lang="pug">
.root
  nav.navbar.navbar-inverse.navbar-fixed-top.top-var
    .navbar-brand.tab.header むらためも
    .navbar-brand.tab.header All
    .navbar-brand.tab(v-for="(tab,i) in tabs") {{ tab.name }}
  .under-fixed-top
    .row
      .sidebar.col-sm-3
        ul.nav.nav-pills.nav-stacked
          li.nav-item
            a.nav-link All
          li.nav-item(v-for="(side,i) in sides")
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
    getSocket() {
      const socket = io(location.origin);
      socket.on("connect", () => console.log("connect"));
      socket.on("disconnect", () => console.log("disconnect"));
      socket.on("chat", data => console.log("chat:", data));
      return socket;
    }
  },
  data() {
    return {
      sides: [],
      tabs: [],
      contents: [],
      currentSide: 4,
      currentTab: 4,
      socket: this.getSocket()
    };
  },
  mounted() {
    // $.post("/save", this.attrs, null, "json");
    $.getJSON("/load", "", data => {
      this.sides = data.genre;
      this.tabs = data.how;
      this.contents = data.contents[this.currentSide][this.currentTab]; // genre-how-array
      console.log(data);
      this.socket.emit("chat", { ping: "pong" }, data => {
        console.log("io callback:", data);
      });
    });
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