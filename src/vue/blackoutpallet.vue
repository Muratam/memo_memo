<template lang="pug">
.fadelayer(v-if="blackoutPalletType !== ''")
  .blackout(@click="escapeBlackout")
  ul.list-group.pallet
    li.list-group-item
      .blackout-comment {{ blackoutPalletType }}
      .input-group.input-group-lg
        span.input-group-addon.pallet-addon
          i.clickable.fas.fa-search.pallet-icon(v-if="blackoutPalletType === 'find'")
          i.clickable.fas.fa-plus.pallet-icon(v-if="blackoutPalletType === 'addGenre'")
        input.form-control.commandpallet(
            type="text" v-model="blackoutPallet"
            @keydown="decidedAtBlackout" id="blackoutPallet")
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { twoWayBind } from "../js/common";

module.exports = {
  methods: {
    escapeBlackout() {}, // TODO:
    decidedAtBlackout() {} // TODO:
    // TODO: こんな分かりにくい方法じゃなくて const とかでいい感じにやりたい
  },
  computed: {
    ...twoWayBind(["blackoutPallet"]),
    ...mapState(["blackoutPalletType"])
  }
};
</script>
<style scoped lang="less">
@import "../css/common.less";
.pallet {
  .pallet-back {
    font-size: 1.5em;
    margin: 0;
    margin-right: 0.4em;
    padding: 0;
    .pallet-icon {
      margin-left: 1em;
    }
  }
  .pallet-addon {
    background-color: #fff;
  }
  .commandpallet {
    overflow: auto;
  }
  li {
    background-color: #00000000;
    border-color: #00000000;
  }
}

.fadelayer {
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 10000;
  .blackout {
    background-color: #000;
    opacity: 0.5;
    width: 100vw;
    height: 100vh;
    // visibility: hidden;
  }
  ul {
    position: fixed;
    top: 40%;
    left: 0px;
    width: 100vw;
    height: 100vh;
  }
  ul {
    padding-right: 1em;
    margin-right: 1em;
  }
  li {
    background-color: #00000000;
    border-color: #00000000;
    margin-left: @sidebar-size;
    margin-right: 2em;
  }
  .blackout-comment {
    font-size: 3em;
    color: #eeeeee;
  }
}
</style>