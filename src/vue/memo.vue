<template lang="pug">
.memo(:class="{ isadd: isAddButton}")
  .clearfix(v-if="!isediting && !isAddButton")
    .pull-right
      span.right-icon.clickable(@click="startEditing")
        i.fas.fa-edit
      span.right-icon.clickable(@click="trush")
        i.fas.fa-times
    a(:href="url" v-if="url" target="_blank") {{ title }}
    div(v-if="!url") {{ title }}
    div(v-if="body") {{ body }}
  .clearfix( v-if="isediting || isAddButton")
    button.btn.btn-default.pull-right.btn-sm(@click="finishEditing")
      div(v-if="!isAddButton"): i.fas.fa-chevron-right
      div(v-if="isAddButton"): i.fas.fa-plus
    .input-group.input-group-sm.col-xs-11(v-if="!isAddButton")
      span.input-group-addon URL
      input.form-control.col-xs-5(type="text" placeholder="https://..." v-model="url")
    .input-group.input-group-sm.col-xs-11
      span.input-group-addon(v-if="!isAddButton") Title
      input.form-control(type="text" v-model="title")
    .input-group.input-group-sm.col-xs-11(v-if="!isAddButton")
      textarea.form-control(v-model="body")

</template>
<script>
module.exports = {
  methods: {
    trush() {
      this.$emit("trush", this.serialized());
    },
    startEditing() {
      this.isediting = true;
    },
    finishEditing() {
      if ($.trim(this.title) === "") return;
      this.isediting = false;
      this.$emit("update", this.serialized());
      if (this.isAddButton) {
        this.url = this.title = this.body = "";
      }
    },
    serialized() {
      return {
        url: this.url,
        body: this.body,
        id: this.id,
        title: this.title
      };
    }
  },
  data() {
    return {
      title: this.attrs.title || "",
      url: this.attrs.url || "",
      body: this.attrs.body || "",
      isediting: this.attrs.isediting || false,
      id: this.attrs.id || "",
      isAddButton: this.attrs.isAddButton || false
    };
  },
  props: ["attrs"]
  //   watch: { abc(val, oldVal) {} }
};
</script>
<style scoped lang="less">
.memo {
  max-height: 100vh;
  transition: all 1s ease;
  overflow: auto;
}
.clickable {
  cursor: pointer;
}
.right-icon {
  margin-left: 0.2em;
  margin-right: 0.2em;
  color: #ccc;
  &:hover {
    color: #888;
  }
}
</style>