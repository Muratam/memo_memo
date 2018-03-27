<template lang="pug">
.memo
  .clearfix(v-if="!isediting")
    .pull-right
      span.right-icon.clickable(@click="startEditing")
        i.fas.fa-edit
    a(:href="url" v-if="url" target="_blank") {{ title }}
    div(v-if="!url") {{ title }}
    .bodytext(v-if="body") {{ body }}
  .clearfix( v-if="isediting")
    span.right-icon.clickable.pull-right(@click="finishEditing")
      i.fas.fa-chevron-right()
    span.right-icon.clickable.pull-left(@click="trush")
      i.fas.fa-times
    .input-group.input-group-sm.col-xs-12
      span.input-group-addon URL
      input.urltext.form-control.col-xs-5(type="text" placeholder="https://..." v-model="url" @keydown="submit")
    .input-group.input-group-sm.col-xs-12
      span.input-group-addon Title
      input.form-control(type="text" v-model="title" @keydown="submit")
    .input-group.input-group-sm.col-xs-12
      textarea(
          v-model="body" rows="3"
          v-on:click="autoGrow($event.target)"
          v-on:keyup="autoGrow($event.target)")

</template>
<script>
module.exports = {
  methods: {
    submit() {
      if (window.event.keyCode !== 13) return;
      this.finishEditing();
    },
    autoGrow(element) {
      element.style.height = "1em";
      element.style.height = element.scrollHeight + "px";
    },
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
      id: this.attrs.id || ""
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
.bodytext {
  padding: 0.2em;
  padding-bottom: 0em;
  padding-left: 0.5em;
  white-space: pre !important;
  background-color: #fdfdff;
  border-radius: 0.2em / 1em;
  font-size: 0.9em;
  overflow-x: auto;
  color: #447;
  font-family: "Courier New", Consolas, monospace;
  &::-webkit-scrollbar {
    display: none;
  }
}
textarea {
  font-family: "Courier New", Consolas, monospace;
  width: 100%;
  background-color: #fdfdff;
  color: #447;
  &::-webkit-scrollbar {
    display: none;
  }
}
.urltext {
  color: #48f;
}
</style>