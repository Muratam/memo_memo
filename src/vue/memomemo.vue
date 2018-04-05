<template lang="pug">
.root
  topbar
  .under-fixed-top
    sidebar
    contents
    bottompallet
  blackoutpallet

</div>
</template>
<script>
import TopBar from "./topbar";
import SideBar from "./sidebar";
import Contents from "./contents";
import BottomPallet from "./bottompallet";
import BlackoutPallet from "./blackoutpallet";

module.exports = {
  mounted() {
    this.$store.commit("setupSaveData");
  },
  components: {
    topbar: TopBar,
    sidebar: SideBar,
    contents: Contents,
    bottompallet: BottomPallet,
    blackoutpallet: BlackoutPallet
  }
};
</script>
<style scoped lang="less">
@import "../css/common.less";
</style>