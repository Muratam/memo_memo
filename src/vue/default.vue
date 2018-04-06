<template lang="pug">
div
</template>
<script>
import { toVue } from "../js/tovue";
export default toVue(
  class {
    static get props(){ return ["a","b"]; }
    static get components(){ return {};}
    constructor(a,b) {}
    get $$b(){}
    set $$b(){}
  }
);
</script>
<style scoped lang="less">
@import "../css/common.less";
</style>