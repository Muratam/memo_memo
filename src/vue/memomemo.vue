<template lang="pug">
.root
  //- topbar
  //- .under-fixed-top
    sidebar
    contents
    bottompallet
  //- blackoutpallet

</div>
</template>
<script>
import { toVue } from "../js/tovue";

// import TopBar from "./topbar";
// import SideBar from "./sidebar";
// import Contents from "./contents";
// import BottomPallet from "./bottompallet";
// import BlackoutPallet from "./blackoutpallet";
// import { mutations } from "../js/common";
// TODO: tovueのアップデート

class MemoMemo {
  constructor() {}
  mounted() {
    this.$$setupSaveData();
  }
  get $$setupSaveData() {}
  static components() {
    return {
      // topbar: TopBar,
      // sidebar: SideBar,
      // contents: Contents,
      // bottompallet: BottomPallet,
      // blackoutpallet: BlackoutPallet
    };
  }
}
export default toVue(MemoMemo);
</script>
<style scoped lang="less">
@import "../css/common.less";
</style>