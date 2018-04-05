<template lang="pug">
nav.navbar.navbar-fixed-bottom.content
  ul.list-group.pallet
    li.list-group-item
      .input-group.input-group-sm.col-xs-12.has-feedback
        input.form-control.commandpallet(
            type="text" v-model="commandPallet"
            @keydown="addMemo" autofocus
            id="commandPallet")
        span.input-group-addon.pallet-addon.form-control-feedback.feedbackicon
          i.fas.fa-plus.pallet-icon
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { autoUpdateByAssign } from "../js/common";
module.exports = {
  methods: {
    addMemo(data) {
      /* TODO: メモの追加
      if (!this.isDecided()) return;
      let title = $.trim(this.commandPallet);
      if (title === "") return;
      data = {
        url: "",
        body: "",
        id: this.getRandomHash(),
        title: ""
      };
      if (/^https?:\/\//.test(title)) {
        data.url = data.title = title;
        if (this.currentHow === "all") data.how = "url";
      } else data.title = title;
      this.updateContent(data.id, data);
      this.commandPallet = "";
      */
    }
  },
  computed: {
    ...autoUpdateByAssign(["commandPallet"])
  }
};
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
}
</style>