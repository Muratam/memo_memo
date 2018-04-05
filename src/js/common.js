// vuexのstoreのmutationsに配置 :: `\$${key}`=> state[key] = v を追加
export function mutationByAssign(key) {
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
// vueのcomponentに配置 :: 代入で自動更新commitを送る
export function autoUpdateByAssign(key) {
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

// mutations(this).hoge("h") => this.commit('hoge',"h"); みたいにかける
export function mutations(self) {
  if ('__mutations' in self) return self.__mutations;
  self.__mutations = new Proxy(self, {
    get: (_, name) => args => {
      if ('commit' in self) {  // @store
        self.commit(name, args);
      } else {  // @component
        self.$store.commit(name, args);
      }
    }
  });
  return self.__mutations;
}
export function getRandomHash(length = 32) {
  let res = '';
  while (res.length < length) {
    res += Math.random().toString(36).slice(-8);
  }
  return res.slice(-length);
}
Array.prototype.groupBy = function(keyFunc) {
  let res = {};
  this.forEach(c => {
    let key = keyFunc(c);
    if (key in res)
      res[key].push(c);
    else
      res[key] = [c];
  });
  // WARN: 暗黙の型変換が入るので注意！！
  return Object.keys(res).map(k => ({key: k, value: res[k]}));
};
