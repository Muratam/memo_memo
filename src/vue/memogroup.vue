<template lang="pug">
.ul-title(v-if="length > 0" :class="{hidedown:minimized}")
  .clearfix
    span.clickable.name(@click="link") {{ name }}
    .pull-right
      span.num-label.label {{ length }}
      span.right-icon.clickable(@click="toggleMinimized")
        i.fas.fa-caret-up
</template>
<script>
module.exports = {
  methods: {
    toggleMinimized() {
      this.minimized = !this.minimized;
      console.log(this.minimized);
    },
    link() {
      this.$emit("link", this.linkGenre, this.linkHow);
    }
  },
  data() {
    return {
      minimized: false
    };
  },
  props: ["name", "length", "linkGenre", "linkHow"]
};
</script>
<style scoped lang="less">
// WARN: import したほうがいい？
@accent-color3: hsl(208, 50%, 70%);

.num-label {
  margin-left: 0.5em;
  margin-right: 0.5em;
  font-size: 0.8em;
  margin-top: 1em;
  padding-top: 0em;
  padding-bottom: 0em;
  background-color: @accent-color3 + #111;
  color: @accent-color3 + #444;
}
.right-icon {
  margin: 0em 0.3em 0em 0.3em;
  color: #ddf;
  &:hover {
    color: #eef;
  }
}
.name {
  padding: 0.3em 0.5em 0.4em 0em;
  // background: #fff;
}
.clickable {
  cursor: pointer;
}
.hidedown + * {
  display: none;
}
</style>
