export function mutation(key) {
  let res = {};
  res['$' + key] = function(state, value) {
    state[key] = value;
  };
  return res;
}

export function twoWayBind(key) {
  let property = {
    get() {
      return this.$store.state[key];
    },
    set(value) {
      this.$store.commit('$' + key, value);
    }
  };
  let res = {};
  res[key] = property;
  return res;
};
