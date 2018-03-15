<template lang="pug">
  .root
    .sidebar
      .header むらためもめも
      .side All
      .side(v-for="(side,i) in sides" @click="event") {{ side.name }}
      .side.appender [+]
    .leftsidebar
      .tabbar
        .tab.header All
        .tab(v-for="(tab,i) in tabs" @click="event") {{ tab.name }}
      .content
        .memo(v-for="(memo,i) in contents" @click="event")
          a(:href="getURL(memo)") {{ getTitle(memo) }}
          div(v-if="getBody(memo)") {{ getBody(memo) }}
      //- button.side(v-for="(side,i) in sides" onclick="open(event)") {{side.name}}
      //- button.tab.link(v-for="(tab,i) in tabs" onclick="open(event)") {{tab.name}}
</template>
<script>
import contents from "../tempdata";
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
.memo {
  background: #f8f8f8;
  padding: 0.5em 1em 0.5em 1em;
  border-bottom: 1px solid @accent-color3;
  // box-shadow: 0 0 0.6em rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}
</style>