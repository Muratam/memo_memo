<template lang="pug">
.row
  .sidebar.col-sm-3
    ul.nav.nav-pills.nav-stacked
      li.nav-item.clickable(
          :class="{ active: currentGenre ===  'all' }"
          @click="currentGenre = 'all'")
        a.nav-link All
      li.nav-item.clickable(
          v-for="(side,i) in genres"
          :class="{ active: currentGenre === side.id }"
          @click="sidebarClick($event,side.id)"
          :key="side.id"
          draggable="true"
          @dragstart="$event.dataTransfer.setData('sideid', side.id)"
          @dragover="$event.preventDefault()"
          @dragenter="$event.target.classList.add('dropping')"
          @dragleave="$event.target.classList.remove('dropping')"
          @drop="sidebarDrop($event,side.id)")
        a.nav-link {{ side.name }}
        //- .input-group.rename-genre
          input.form-control.rename-genre(
              type="text" placeholder="Rename Genre"
              @keydown="submitRenameGenre($event,side.id)")
          //-  v-model="url" @keydown="submit"
      li.nav-item.clickable(@click="startBlackout('addGenre')")
        a.nav-link
          i.fas.fa-plus

</template>
<script>
import { mapState, mapGetters } from "vuex";
import { twoWayBind } from "../js/common";

module.exports = {
  methods: {
    sidebarClick(event, sideId) {
      if (this.currentGenre !== sideId) {
        this.currentGenre = sideId;
        return;
      }
      // TODO:rename
    },
    startBlackout() {}, // TODO:
    sidebarDrop() {} //TODO:
  },
  computed: {
    ...twoWayBind(["currentGenre"]),
    ...mapState(["genres"])
  }
};
</script>
<style scoped lang="less">
@import "../css/common.less";

.sidebar {
  transition: all 0.3s;
  padding: 0em;
  padding-bottom: 10em;
  width: @sidebar-size;
  height: 100%;
  padding-left: 1em;
  position: fixed;
  text-align: center;
  overflow-y: scroll;
  background: @accent-color2 + #333;
  box-shadow: 0.1em 0 0.2em rgba(0, 0, 0, 0.2);
  &::-webkit-scrollbar {
    width: 0;
  }
  .dropping {
    background-color: #fff;
  }
  .rename-genre {
    background: @accent-color2 + #333;
    border: 0 solid #fff;
  }
}
</style>