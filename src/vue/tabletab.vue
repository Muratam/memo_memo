<template lang="pug">
  div
    .sidebar
      h5.side Menu
      button.side(v-for="(side,i) in sides" onclick="open(event)") {{side.name}}
    .tabbar
      button.tab.link(v-for="(tab,i) in tabs" onclick="open(event)") {{tab.name}}
    .content
</template>
<script>
module.exports = {
  data() {
    return {
      tabs: [{ name: "name1" }, { name: "name2" }, { name: "name3" }],
      sides: [{ name: "name1" }, { name: "name2" }, { name: "name3" }]
    };
  },
  mounted() {},
  components: {
    container: {
      props: ["index", "abc"],
      template: `<div></div>`,
      watch: { abc(val, oldVal) {} }
    }
  }
};
</script>
<style scoped lang="less">
@dark-color: #111;
@accent-color : hsl(208, 40%, 50%);
@accent-color2: hsl(208, 15%, 77%);
@accent-color3: hsl(208, 50%, 70%);
.tabs {
  margin: 1em auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.item {
  background-color: @dark-color;
  float: left;
  transition: all 0.2s ease;
}
.tag {
  color: @accent-color3;
  display: block;
  text-align: center;
  font-weight: bold;
  border-bottom: 0.2em solid @accent-color;
  line-height: 3em;
  &:hover {
    opacity: 0.75;
  }
}

.content {
  // display: none;
  // padding: 40px 40px 0;
  color: @accent-color2;
  clear: both;
  // overflow: hidden;
  font-weight: normal;
}
</style>