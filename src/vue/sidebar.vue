<template lang="pug">
.row
  .sidebar.col-sm-3
    ul.nav.nav-pills.nav-stacked
      li.nav-item.clickable(
          :class="{ active: $$currentGenre ===  'all' }"
          @click="$$currentGenre = 'all'")
        a.nav-link All
      sidebartab(:name="side.name" :id="side.id"
                 :key="side.id" v-for="side in $$genres")
      li.nav-item.clickable(
          @click="$$startBlackout('addGenre')")
        a.nav-link
          i.fas.fa-plus

</template>
<script>
import { toVue } from "../js/tovue";
import { getRandomHash } from "../js/common";
import SideBarTab from "./sidebartab";
class SideBar {
  get $$currentGenre() {}
  set $$currentGenre(_) {}
  get $$genres() {}
  get $$startBlackout() {}
  static get components() {
    return { sidebartab: SideBarTab };
  }
}

export default toVue(SideBar);
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
}
</style>