<template lang="pug">
.memo
  .clearfix(v-if="!isediting")
    button.btn.btn-default.pull-right(@click="startEditing")
      div: i.fas.fa-edit
    a(:href="url" v-if="url" target="_blank") {{ title }}
    div(v-if="!url") {{ title }}
    div(v-if="body") {{ body }}
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
      $.post("/save", this.attrs, null, "json");
      $.getJSON("/load", "", data => {
        console.log(data);
      });
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
  max-height: 100vh;
  transition: all 1s ease;
}
</style>