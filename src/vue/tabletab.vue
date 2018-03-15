<template lang="pug">
  .root
    .sidebar
      .header hoge
      .side.active hoge
      .side hogehgoeghoaheoahfpi
      .side hoge
    .content-wrapper
      .tabbar
        .tab fuga
        .tab fuga
        .tab fuga
      .content
        p ghi0reHAFUWOgjhwer
        p ghi0reHAFUWOgjhwer
        p ghi0reHAFUWOgjhwer
        p ghi0reHAFUWOgjhwer
    //- .wrapper
    //-   #sidebar
    //-     .sidebar-header
    //-     .list-unstyled.components
    //-       li.active
    //- .sidebar
      //- h5.side Menu
      //- button.side(v-for="(side,i) in sides" onclick="open(event)") {{side.name}}
    //- .tabbar
      //- button.tab.link(v-for="(tab,i) in tabs" onclick="open(event)") {{tab.name}}
    //- .content
</template>
<script>
module.exports = {
  data() {
    return {
      tabs: [{ name: "name1" }, { name: "name2" }, { name: "name3" }],
      sides: [{ name: "name1" }, { name: "name2" }, { name: "name3" }]
    };
  },
  mounted() {},
  components: {
    container: {
      props: ["index", "abc"],
      template: `<div></div>`,
      watch: { abc(val, oldVal) {} }
    }
  }
};
</script>
<style scoped lang="less">
@dark-color: #111;
@accent-color : hsl(208, 40%, 50%);
@accent-color2: hsl(208, 15%, 77%);
@accent-color3: hsl(208, 50%, 70%);
@sidebar-size: 10em;
.root {
  display: flex;
  flex-direction: row;
}
.sidebar {
  transition: all 0.3s;
  background: @dark-color;
  color: @accent-color2;
  // align-items: stretch;
  padding: 0em 1em 0em 1em;
  min-height: 100vh;
  align-items: stretch;
  border-right: 0.3em solid @accent-color;
  max-width: @sidebar-size;
  overflow-wrap: break-word;
  // &.active {margin-left: -@sidebar-size;}
  .header {
    padding: 1em 0 1em 0;
    color: @accent-color3;
    border-bottom: 1px solid @accent-color3;
  }
  .side {
    padding: 0.5em 0 0.5em 0;
    border-bottom: 1px solid #111 * 4;
  }
}
.content-wrapper {
}
.tabbar {
  margin: auto;
  display: flex;
  flex-direction: row;
  transition: all 0.3s;
  border-bottom: 1px solid @accent-color3;
}
/*
.sidebar {
  min-height: 100vh;
}
*/
/*
.tabs {
  margin: 1em auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.item {
  background-color: @dark-color;
  float: left;
  transition: all 0.2s ease;
}
.tag {
  color: @accent-color3;
  display: block;
  text-align: center;
  font-weight: bold;
  border-bottom: 0.2em solid @accent-color;
  line-height: 3em;
  &:hover {
    opacity: 0.75;
  }
}

.content {
  // display: none;
  // padding: 40px 40px 0;
  color: @accent-color2;
  clear: both;
  // overflow: hidden;
  font-weight: normal;
}*/
/*
.item {
  width: calc(90%/3);
  height: 50px;
  border-bottom: 3px solid #5ab4bd;
  background-color: #d9d9d9;
  line-height: 50px;
  font-size: 16px;
  text-align: center;
  color: #565656;
  display: block;
  float: left;
  text-align: center;
  font-weight: bold;
  transition: all 0.2s ease;
  .center {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
  }
}
// ラジオボタンを全て消す
input[name="tab_item"] {
  display: none;
}
//タブ切り替えの中身のスタイル
.content {
  display: none;
  padding: 40px 40px 0;
  clear: both;
  overflow: hidden;
}
//選択されているタブのスタイルを変える
.tabs input:checked + .tab_item {
  background-color: #5ab4bd;
  color: #fff;
}

//選択されているタブのコンテンツのみを表示
#tab1:checked ~ #tab1_content,
#tab2:checked ~ #tab2_content,
#tab3:checked ~ #tab3_content {
  display: block;
}
*/
</style>