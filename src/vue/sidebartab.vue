<template lang="pug">
li.nav-item.clickable(
    :class="{ active: $$currentGenre === id }"
    @click="click($event,id)"
    draggable="true"
    @dragstart="$event.dataTransfer.setData('sideid', id)"
    @dragover="$event.preventDefault()"
    @dragenter="$event.target.classList.add('dropping')"
    @dragleave="$event.target.classList.remove('dropping')"
    @drop="drop($event,id)")
  a.nav-link(v-if="!isRenaming") {{ name }}
  .input-group.rename-genre(v-if="isRenaming")
    input.form-control.rename-genre(
        type="text" placeholder="Rename Genre"
        v-model="renaming"
        ref="renameinput"
        @keypress="submitRename($event,id)")

</template>
<script>
import { toVue } from "../js/tovue";
class SideBarTab {
  constructor(name, id) {
    this.isRenaming = false;
    this.renaming = name;
  }
  get $$currentGenre() {}
  set $$currentGenre(_) {}
  get $$updateContent() {}
  get $$swapGenre() {}
  get $$changeGenreHowOfContent() {}
  get $$renameGenre() {}
  static get props() {
    return ["name", "id"];
  }
  submitRename(event, id) {
    if (event.code !== "Enter") return;
    this.isRenaming = false;
    this.$$renameGenre(id, this.renaming);
  }
  click(event, sideId) {
    if (this.$$currentGenre !== sideId) {
      this.$$currentGenre = sideId;
      return;
    }
    if (this.id === "trash" || this.id === "temporary") return;
    this.isRenaming = true;
    this.$nextTick(() => {
      this.$refs.renameinput.focus();
    });
  }
  mounted() {
    $(document).keydown(e => {
      if (e.keyCode !== 27) return; // Esc
      this.renaming = this.name;
      this.isRenaming = false;
    });
  }
  drop(event, sideId) {
    event.preventDefault();
    event.target.classList.remove("dropping");
    let transferSideId = event.dataTransfer.getData("sideid");
    if (transferSideId === "") {
      let data = event.dataTransfer.getData("memo");
      if (data === "") return;
      let id = JSON.parse(data).id;
      this.$$changeGenreHowOfContent(id, null, sideId);
    } else {
      this.$$swapGenre(transferSideId, sideId);
    }
  }
}
export default toVue(SideBarTab);
</script>
<style scoped lang="less">
@import "../css/common.less";
.rename-genre {
  background: @accent-color2 + #333;
  border: 0 solid #fff;
}
.dropping {
  background-color: #fff;
}
</style>