<template lang="pug">
.memo
  .clearfix(v-if="!isediting")
    button.btn.btn-default.pull-right(@click="isediting = !isediting")
      i.fas.fa-sync
    a(:href="url") {{ title }}
    div(v-if="body") {{ body }}
  .clearfix(v-if="isediting")
    button.btn.btn-default.pull-right(@click="isediting = !isediting")
      i.fas.fa-sync
    .input-group.input-group-sm.col-xs-10
      span.input-group-addon URL
      input.form-control.col-xs-5(type="text" placeholder="https://..." :value="url")
    .input-group.input-group-sm.col-xs-10
      span.input-group-addon Title
      input.form-control(type="text" :value="title")
    .input-group.input-group-sm.col-xs-10
      textarea.form-control(:value="body")

</template>
<script>
module.exports = {
  methods: {},
  props: ["title", "url", "body", "isediting"]
  //   mounted() {},
  //   watch: { abc(val, oldVal) {} }
};
</script>
<style scoped lang="less">
.memo {
  // background: #f8f8f8;
  // box-shadow: 0 0 0.6em rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}
</style>