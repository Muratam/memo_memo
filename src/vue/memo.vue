<template lang="pug">
.memo
  .clearfix(v-if="!isediting && !alwaysEditState")
    button.btn.btn-default.pull-right.btn-sm(@click="startEditing")
      div: i.fas.fa-edit
    button.btn.btn-default.pull-right.btn-sm(@click="trash")
      div: i.fas.fa-trash-alt
    a(:href="url" v-if="url" target="_blank") {{ title }}
    div(v-if="!url") {{ title }}
    div(v-if="body") {{ body }}
  .clearfix(v-if="isediting || alwaysEditState")
    button.btn.btn-default.pull-right.btn-sm(@click="finishEditing")
      div: i.fas.fa-chevron-right
    .input-group.input-group-sm.col-xs-11
      span.input-group-addon URL
      input.form-control.col-xs-5(type="text" placeholder="https://..." v-model="url")
    .input-group.input-group-sm.col-xs-11
      span.input-group-addon Title
      input.form-control(type="text" v-model="title")
    .input-group.input-group-sm.col-xs-11
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
      this.update({
        title: this.title,
        url: this.url,
        body: this.body,
        id: this.id
      });
    }
  },
  data() {
    return {
      title: this.attrs.title || "",
      url: this.attrs.url || "",
      body: this.attrs.body || "",
      isediting: this.attrs.isediting || false,
      id: this.attrs.id || "",
      update: this.attrs.update || function(data) {},
      trash: this.attrs.trash || function() {},
      alwaysEditState: this.attrs.alwaysEditState || false
    };
  },
  props: ["attrs"]
  //   watch: { abc(val, oldVal) {} }
};
</script>
<style scoped lang="less">
.memo {
  // background: #f8f8f8;
  // box-shadow: 0 0 0.6em rgba(0, 0, 0, 0.2);
  max-height: 100vh;
  transition: all 1s ease;
}
</style>