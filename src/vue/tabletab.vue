<template lang="pug">
.root
  nav.navbar.navbar-inverse.navbar-fixed-top
    .navbar-brand.tab.header All
    .navbar-brand.tab(v-for="(tab,i) in tabs" @click="event") {{ tab.name }}
  .under-fixed-top
    .row
      .sidebar.col-sm-3
        ul.nav.nav-pills.nav-stacked
          li.nav-item
            a.nav-link むらためもめも
          li.nav-item
            a.nav-link All
          li.nav-item(v-for="(side,i) in sides")
            a.nav-link(@click="event") {{ side.name }}
          li.nav-item
            a.nav-link
              span.glyphicon.glyphicon-plus
          //- li.nav-item(v-for="i in 100")
          //-   a.nav-link [{{i}}]
    .content
      ul.list-group(v-for="i in 10")
        li.list-group-item(v-for="(memo,i) in contents" @click="event")
          a(:href="getURL(memo)") {{ getTitle(memo) }}
          div(v-if="getBody(memo)") {{ getBody(memo) }}3
        li.list-group-item
          .input-group.input-group-sm.col-xs-11
            span.input-group-addon URL
            input.form-control.col-xs-5(type="text" placeholder="https://...")
          .input-group.input-group-sm.col-xs-11
            span.input-group-addon Title
            input.form-control(type="text" )
          .input-group.input-group-sm.col-xs-11
            textarea.form-control
      //- nav.navbar.navbar-fixed-bottom.content
        .panel.panel-default

</div>
</template>
<script>
// import contents from "../tempdata";
module.exports = {
  methods: {
    getTitle(memo) {
      if (!("title" in memo)) return "???";
      return memo.title;
    },
    getBody(memo) {
      if (!("body" in memo)) return "";
      return memo.body;
    },
    getURL(memo) {
      if (!("url" in memo)) return "";
      return memo.url;
    }
  },
  data() {
    return {
      sides: [
        // 主ジャンル
        { name: "WorkSpace", id: 1 },
        { name: "フォント", id: 2 },
        { name: "CTF", id: 3 },
        { name: "Deep Learning", id: 4 },
        { name: "シェーダー", id: 5 },
        { name: "Tool", id: 6 },
        { name: "Trash", id: 7 }
      ],
      tabs: [
        // 時間軸
        { name: "Todo", id: 1 }, // 近い内に「やらないといけない」予定を保存
        { name: "Later", id: 2 }, // 「そのうち遊ぶ・実装したいかもしれない」アイデアを保存
        { name: "URL", id: 3 }, // 「必要に応じて参照する」と便利かもしれないURLを保存
        { name: "Study", id: 4 }, // 「時間をとって体系的に学習する」かもしれないものを保存
        { name: "Data", id: 5 } // 「暇な時に漁れる」データ集やコーパス集を保存
      ],
      contents: [
        {
          title: "フレームワーク: deeplearn.js",
          body: "WebGL + GPU でブラウザ上で高速に処理"
        },
        { title: "理論: CAN", url: "http://createwith.ai/paper/20170629/839" },
        {
          title: "理論: StacksGAN",
          url: "http://catindog.hatenablog.com/entry/2017/02/05/160156"
        },
        {
          title: "学習済みモデル: illustlation2vec",
          url: "https://github.com/rezoo/illustration2vec"
        },
        {
          title: "学習済みモデル: word2vec",
          url:
            "https://aial.shiroyagi.co.jp/2017/02/japanese-word2vec-model-builder/"
        }
      ] //contents.contents
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
  // border-right: 1px solid @accent-color3;
  width: @sidebar-size;
  height: 100%;
  padding-left: 1em;
  position: fixed;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: center;
  overflow-wrap: break-word;
  z-index: 10;
  // background: #ffffff;
  // align-items: stretch;
  background: @accent-color2 + #333;
  // color: @accent-color2;
  // border-bottom: 1px solid @accent-color3;
  // &.active {margin-left: -@sidebar-size;}
  // opacity: 0.75;
  // cursor: pointer;
}
.content {
  padding-top: 1em;
  padding-right: 1em;
  margin-left: @sidebar-size;
}

.memo {
  // background: #f8f8f8;
  // box-shadow: 0 0 0.6em rgba(0, 0, 0, 0.2);
  // transition: all 0.2s ease;
}
</style>