<template lang="pug">
  .root
    .sidebar
      .header むらためもめも
      .side(v-for="(side,i) in sides" onclick="event") {{side.name}}
      .side.appender [+]
    .leftsidebar
      .tabbar
        .tab.header All
        .tab.link(v-for="(tab,i) in tabs" onclick="event") {{tab.name}}
      .content
        p ghi0reHAFUWOgjhwer
        p ghi0reHAFUWOgjhwer
        p ghi0reHAFUWOgjhwer
        p ghi0reHAFUWOgjhwer
      //- button.side(v-for="(side,i) in sides" onclick="open(event)") {{side.name}}
      //- button.tab.link(v-for="(tab,i) in tabs" onclick="open(event)") {{tab.name}}
</template>
<script>
import contents from "../tempdata";
module.exports = {
  data() {
    console.log(contents);
    return {
      sides: [
        // 主ジャンル
        { name: "WorkSpace", id: 0 },
        { name: "Nim", id: 1 },
        { name: "フォント", id: 2 },
        { name: "CTF", id: 3 },
        { name: "Deep Learning", id: 4 },
        { name: "シェーダー", id: 5 },
        { name: "Tool", id: 6 },
        { name: "Trash", id: 7 }
      ],
      tabs: [
        { name: "Todo", id: 1 }, // 近い内に「やらないといけない」予定を保存
        { name: "Later", id: 2 }, // 「そのうち遊ぶ・実装したいかもしれない」アイデアを保存
        { name: "URL", id: 3 }, // 「必要に応じて参照する」と便利かもしれないURLを保存
        { name: "Study", id: 4 }, // 「時間をとって体系的に学習する」かもしれないものを保存
        { name: "Data", id: 5 } // 暇な時に適当に漁って楽しめるデータ集やコーパス集を保存
      ],
      contents: contents.contents
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
@dark-color: #222;
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
    &.appender {
      color: @accent-color3;
      text-align: center;
      border-bottom: 0px;
    }
    &:hover {
      opacity: 0.75;
      cursor: pointer;
    }
  }
}
.leftsidebar {
  flex: 1;
}
.tabbar {
  display: flex;
  flex-direction: row;
  transition: all 0.3s;
  border-bottom: 1px solid @accent-color3;
  background: @dark-color * 2;
  color: @accent-color2 * 1.2;
  .header {
    border-right: 1px solid @accent-color3;
    padding: 0.5em 1.5em 0.5em 1.5em;
    color: @accent-color3;
  }
  .tab {
    padding: 0.5em 1em 0.5em 1em;
    max-width: @sidebar-size;
    overflow: hidden;
    border-right: 1px solid #111 * 6;
    &:hover {
      opacity: 0.75;
      cursor: pointer;
    }
  }
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
}
*/
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