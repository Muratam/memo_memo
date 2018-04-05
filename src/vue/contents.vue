<template lang="pug">
.content.over-fixed-buttom
  ul.list-group(v-if="visibleMemoCount === 0")
    .ul-title {{ findQuery === "" ? "No memos..." : `No matching for "${findQuery}"` }}
  ul.list-group(v-for="memoGroup in visibleContents" :key="memoGroup.id")
    .ul-title(v-if="memoGroup.memos.length > 0")
      .clearfix
        span.clickable.name(
            data-toggle="collapse" :data-target="'#'+memoGroup.id"
            ) {{ memoGroup.name }}
        span.num-label.label {{ memoGroup.memos.length }}
        .pull-right
          span.right-icon.clickable(@click="currentGenre = memoGroup.genre,currentHow = memoGroup.how")
            i.fas.fa-arrow-alt-circle-right
    .collapse.in(:id="memoGroup.id")
      li.list-group-item(
          v-for="memo in memoGroup.memos"
          :key="memo.id"
          @dragover="$event.preventDefault()"
          @dragenter="$event.target.classList.add('dropping')"
          @dragleave="$event.target.classList.remove('dropping')"
          @drop="swapContent($event,memo.id)")
        memo( :data="memo")
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { autoUpdateByAssign } from "../js/common";
import Memo from "./memo";

module.exports = {
  methods: {
    swapContent(event, memoid) {
      /* TODO: メモの入れ替え
      event.preventDefault();
      event.target.classList.remove("dropping");
      let data = event.dataTransfer.getData("memo");
      if (!data) return;
      data = JSON.parse(data);
      let dataAIndex = this.contents.findIndex(x => x.id === data.id);
      if (dataAIndex === -1) return;
      let dataBIndex = this.contents.findIndex(x => x.id === memoid);
      if (dataBIndex === -1) return;
      if (dataAIndex === dataBIndex) return;
      let dataA = this.contents[dataAIndex];
      let dataB = this.contents[dataBIndex];
      if (dataA.genre === dataB.genre && dataA.how === dataB.how) {
        // 順番入れ替え
        this.contents.splice(dataAIndex, 1, dataB);
        this.contents.splice(dataBIndex, 1, dataA);
      } else {
        // dataA をdataBの下に追加
        dataA.genre = dataB.genre;
        dataA.how = dataB.how;
        this.contents.splice(dataAIndex, 1, dataA);
      }
      this.saveData.save("contents", this.contents);
      */
    }
  },
  computed: {
    ...autoUpdateByAssign(["currentGenre", "currentHow"]),
    ...mapState(["findQuery"]),
    ...mapGetters(["visibleMemoCount", "visibleContents"])
  },
  components: {
    memo: Memo
  }
};
</script>
<style scoped lang="less">
@import "../css/common.less";
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
    &.dropping {
      background-color: @accent-color2;
    }
  }
}
</style>