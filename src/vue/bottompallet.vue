<template lang="pug">
nav.navbar.navbar-fixed-bottom.content
  ul.list-group.pallet
    li.list-group-item
      .input-group.input-group-sm.col-xs-12.has-feedback
        input.form-control.commandpallet(
            type="text" v-model="commandPallet"
            @keydown="addMemo($event)" autofocus
            id="commandPallet")
        span.input-group-addon.pallet-addon.form-control-feedback.feedbackicon
          i.fas.fa-plus.pallet-icon
</template>
<script>
import { toVue } from "../js/tovue";
import { getRandomHash } from "../js/common";

class BottomPallet {
  constructor() {
    this.commandPallet = "";
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
// TODO: css おかしい
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
}
</style>