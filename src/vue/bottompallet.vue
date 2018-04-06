<template lang="pug">
div
  nav.navbar.navbar-fixed-bottom.content
    .clearfix
      .pull-right
        .right-button.btn-default.btn-circle.clickable(
            @click="showSuperNote = !showSuperNote"
            data-toggle="collapse" data-target="#tempnote")
          i.fas.fa-sticky-note
      ul.list-group.leftpallet
        li.list-group-item
          .input-group.input-group-sm.col-xs-12.has-feedback
            input.form-control.commandpallet(
                type="text" v-model="commandPallet"
                @keydown="addMemo($event)" autofocus
                id="commandPallet")
            span.input-group-addon.pallet-addon.form-control-feedback.feedbackicon
              i.fas.fa-plus.pallet-icon
  textarea.supernote.navbar-fixed-top.collapse(
      id="tempnote"
      v-model="temporaryNote"
      spellcheck="false")
</template>
<script>
import { toVue } from "../js/tovue";
import { getRandomHash } from "../js/common";

class BottomPallet {
  constructor() {
    this.commandPallet = "";
    this.showSuperNote = false;
    this.temporaryNote = localStorage.getItem("temporaryNote") || "";
  }
  watch() {
    return {
      temporaryNote(newVal, oldVal) {
        localStorage.setItem("temporaryNote", newVal);
      }
    };
  }
  addMemo(event) {
    if (event.key !== "Enter") return;
    let title = $.trim(this.commandPallet);
    if (title === "") return;
    let data = {
      url: "",
      body: "",
      id: getRandomHash(),
      title: ""
    };
    if (/^https?:\/\//.test(title)) {
      data.url = data.title = title;
      if (this.$$currentHow === "all") data.how = "url";
    } else data.title = title;
    this.$$addContent(data);
    this.commandPallet = "";
  }
  get $$addContent() {}
  get $$currentHow() {}
}
export default toVue(BottomPallet);
</script>
<style scoped lang="less">
@import "../css/common.less";
.navbar-fixed-bottom {
  margin-bottom: 0em;
  padding-bottom: 0em;
  ul {
    margin-bottom: 0em;
    padding-bottom: 0em;
  }
  margin-top: 1em;
  width: auto;
  margin-left: @sidebar-size;
  margin-right: 0.8em;
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
  .pallet-addon {
    background-color: #fff;
    padding-right: 1.6em;
  }
  .leftpallet {
    margin-right: 4em;
  }
  .right-button {
    background-color: @accent-color3 + #333;
    color: @accent-color - #444;
    border-color: #333;
    margin-top: -0.1em;
    padding-top: 0.3em;
  }
  .btn-circle {
    width: 2em;
    height: 2em;
    text-align: center;
    font-size: 1.5em;
    border-radius: 2em;
  }
}
.supernote {
  position: fixed;
  background-color: #000000cc;
  top: 1vh;
  left: 2vw;
  border-radius: 0.3em;
  margin-right: 1em;
  margin-bottom: 5em;
  height: 90vh;
  padding: 1em;
  width: 94vw;
  color: #eee;
  overflow-y: scroll;
  font-family: "Menlo", "Courier New", Consolas, monospace;
  &::-webkit-scrollbar {
    width: 0;
  }
}
</style>