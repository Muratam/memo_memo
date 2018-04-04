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
module.exports = {
  methods: {},
  data() {
    return {
      commandPallet: ""
    };
  },
  props: []
};
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
}
</style>