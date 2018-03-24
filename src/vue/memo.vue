<template lang="pug">
.memo
  .clearfix(v-if="!isediting")
    button.btn.btn-default.pull-right(@click="startEditing")
      div: i.fas.fa-edit
    a(:href="url") {{ title }}
    pre(v-if="body") {{ body }}
  .clearfix(v-if="isediting")
    button.btn.btn-default.pull-right(@click="finishEditing")
      div: i.fas.fa-chevron-right
    .input-group.input-group-sm.col-xs-10
      span.input-group-addon URL
      input.form-control.col-xs-5(type="text" placeholder="https://..." v-model="url")
    .input-group.input-group-sm.col-xs-10
      span.input-group-addon Title
      input.form-control(type="text" v-model="title")
    .input-group.input-group-sm.col-xs-10
      textarea.form-control(v-model="body")

</template>
<script>
module.exports = {
  methods: {
    startEditing() {
      this.isediting = true;
    },
    finishEditing() {
      this.isediting = false;
    }
  },
  data() {
    return {
      title: this.attrs.title || "",
      url: this.attrs.url || "",
      body: this.attrs.body || "",
      isediting: this.attrs.isediting || false
    };
  },
  props: ["attrs"]
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