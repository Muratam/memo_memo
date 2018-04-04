<template lang="pug">
.memo(ref="elemroot")
  .clearfix(v-if="!isediting")
    .pull-right
      span.right-icon.clickable(@click="startEditing")
        i.fas.fa-edit
      span.right-icon.clickable(@click="trash")
        i.fas.fa-times
    div(ref="infoarea")
      span.left-icon.clickable(
          draggable="true"
          @dragstart="dragStart($event)"
          @dragend="dragEnd($event)")
        i.fas.fa-arrows-alt
      a(:href="url" v-if="url" target="_blank") {{ title }}
      span(v-if="!url") {{ title }}
      .bodytext(v-if="body") {{ body }}
  .clearfix( v-if="isediting")
    .pull-right
      span.right-icon.clickable(@click="finishEditing")
        i.fas.fa-chevron-right
      span.right-icon.clickable(@click="trash")
        i.fas.fa-times
    .input-group.input-group-sm.col-xs-12
      span.input-group-addon URL
      input.urltext.form-control.col-xs-5(
          type="text" placeholder="https://..."
          v-model="url" @keydown="finishIfEnter($event)")
    .input-group.input-group-sm.col-xs-12
      span.input-group-addon Title
      input.form-control(
          type="text" v-model="title"
          @keydown="finishIfEnter($event)")
    .input-group.input-group-sm.col-xs-12
      textarea(
          ref="textarea"
          v-model="body" rows="3"
          v-on:keydown="finishIfCmdEnter($event)"
          v-on:keyup="autoGrow($event.target)")

</template>
<script>
import { getRandomHash } from "../js/common";

module.exports = {
  methods: {
    finishIfEnter(event) {
      if (event.key !== "Enter") return;
      this.finishEditing();
    },
    finishIfCmdEnter(event) {
      if (event.key !== "Enter") return;
      if (!event.metaKey) return;
      this.finishEditing();
    },
    dragStart(event) {
      this.$refs.elemroot.style.opacity = "0.4";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("memo", JSON.stringify(this.serialized()));
      event.dataTransfer.setDragImage(this.$refs.infoarea, -10, -10);
    },
    dragEnd(event) {
      if (!this.$refs.elemroot) return;
      this.$refs.elemroot.style.opacity = "1.0";
    },
    autoGrow(element) {
      let rows = this.body.split("\n").length;
      element.setAttribute("rows", rows <= 3 ? 3 : rows);
    },
    trash() {
      // this.$emit("trash", this.serialized()); // TODO: trashMemo
    },
    startEditing() {
      this.isediting = true;
      this.$nextTick(() => {
        this.autoGrow(this.$refs.textarea);
      });
    },
    finishEditing() {
      if ($.trim(this.title) === "" && $.trim(this.url) === "") return;
      this.isediting = false;
      // this.$emit("update", this.serialized()); // TODO: updateMemo
    },
    serialized() {
      return {
        url: $.trim(this.url),
        body: this.body,
        id: this.id,
        title: $.trim(this.title)
      };
    },
    getData(data = {}) {
      // TODO:
      let { url = "", title = "", body = "" } = data;
      let { id = getRandomHash(), genre = "", how = "" } = data;
      return { url, title, body, id, genre, how, isediting: false };
    }
  },
  data() {
    // TODO:
    return this.getData(this._props.data);
  },
  props: ["data"]
};
</script>
<style scoped lang="less">
@import "../css/common.less";

.memo {
  max-height: 100vh;
  // transition: all 1s ease;
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
.left-icon {
  margin-left: 0.3em;
  margin-right: 0.3em;
  font-size: 0.3em;
  color: #ddd;
  &:hover {
    color: #888;
    cursor: move;
  }
}
.space-right {
  padding-right: 1.5em;
}
.bodytext {
  padding: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 0.5em;
  white-space: pre !important;
  background-color: #f0faff;
  border-radius: 0.2em / 1em;
  font-size: 0.9em;
  overflow-x: auto;
  color: #447;
  font-family: "Courier New", Consolas, monospace;
  &::-webkit-scrollbar {
    height: 0;
  }
}
textarea {
  font-family: "Courier New", Consolas, monospace;
  width: 100%;
  background-color: #fdfdff;
  color: #447;
  &::-webkit-scrollbar {
    width: 0;
  }
}
.urltext {
  color: #48f;
}
</style>