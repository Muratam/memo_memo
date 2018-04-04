export function mutation(key) {
  let getMutationFunc = key => (state, value) => {
    state[key] = value;
  };
  let res = {};
  if (typeof (key) === 'string') {
    res['$' + key] = getMutationFunc(key);
  } else {
    for (let k of key) res['$' + k] = getMutationFunc(k);
  }
  return res;
}

export function twoWayBind(key) {
  let getGetterSetter = key => {
    return {
      get() {
        return this.$store.state[key];
      },
      set(value) {
        this.$store.commit('$' + key, value);
      }
    };
  };
  let res = {};
  if (typeof (key) === 'string') {
    res[key] = getGetterSetter(key);
  } else {
    for (let k of key) res[k] = getGetterSetter(k);
  }
  return res;
};
