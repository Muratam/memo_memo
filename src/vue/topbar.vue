<template lang="pug">
nav.navbar.navbar-inverse.navbar-fixed-top.top-bar
  .navbar-brand.header.clickable(
      @click="$$currentHow = 'all',$$currentGenre = 'all'") memo-memo
  .navbar-brand.header.clickable(
      :class="{ active: $$currentHow === 'all'}"
      @click="$$currentHow = 'all'") All
  .navbar-brand.clickable(
      v-for="(tab,i) in $$hows"
      :class="{ active: $$currentHow === tab.id}"
      :key="tab.id"
      @dragover="$event.preventDefault()"
      @dragenter="$event.target.classList.add('dropping')"
      @dragleave="$event.target.classList.remove('dropping')"
      @drop="dropUpdate($event,tab.id,null)"
      @click="$$currentHow = tab.id") {{ tab.name }}
  .navbar-brand.col-xs-2.pull-right.findbox
    .input-group.input-group-sm.has-feedback
      input.form-control.commandpallet(
          type="text" v-model="$$findQuery"
          :class="{ active: $$findQuery !== '' }"
          id="commandPallet")
      span.input-group-addon.pallet-addon.form-control-feedback.feedbackicon(
          :class="{ active: $$findQuery !== '' }")
        i.fas.fa-search.pallet-icon

</template>
<script>
import { toVue } from "../js/tovue";

class TopBar {
  get $$findQuery() {}
  set $$findQuery(_) {}
  get $$currentHow() {}
  set $$currentHow(_) {}
  get $$currentGenre() {}
  set $$currentGenre(_) {}
  get $$hows() {}
  dropUpdate(event, how, genre) {
    event.preventDefault();
    event.target.classList.remove("dropping");
    let data = event.dataTransfer.getData("memo");
    if (data === "") return;
    data = JSON.parse(data);
    /* TODO: メモを落とされたらメモのgenre/howを変更する
      let savedData = this.contents.find(x => x.id === data.id);
      if (!savedData) return;
      data.genre = genre ? genre : savedData.genre;
      data.how = how ? how : savedData.how;
      this.updateContent(data.id, data);
    */
  }
}
export default toVue(TopBar);
</script>
<style scoped lang="less">
@import "../css/common.less";
.top-bar {
  .navbar-brand {
    box-shadow: 0 0 0.6em rgba(0, 0, 0, 0.2);
    border-left: 1px solid #444;
    &.active {
      background-color: #558;
    }
    &.dropping {
      background-color: #338;
    }
    .feedbackicon {
      padding-right: 1.5em;
    }
  }
  box-shadow: 0.4em 0.4em 0.4em rgba(0, 0, 0, 0.2);
  .findbox {
    // margin: 0em;
    padding-top: 0.6em;
    padding-bottom: 0.3em;
    input {
      background: #111;
      color: #666;
      border-color: #00000000;
      &.active {
        color: #ddd;
      }
    }
    span {
      background: #111;
      border-color: #00000000;
      color: #666;
      &.active {
        color: #ddd;
      }
    }
  }
}
</style>