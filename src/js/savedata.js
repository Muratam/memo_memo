import io from 'socket.io-client';

const typeWebSocket = 'webSocket';
const typeLocalStorage = 'localStorage';

class LocalStorage {
  static getItem(key) {
    let val = localStorage.getItem(location.pathname + ':' + key);
    return JSON.parse(val);
  }
  static setItem(key, value) {
    value = JSON.stringify(value);
    return localStorage.setItem(location.pathname + ':' + key, value);
  }
}

export default class SaveData {
  constructor(type) {
    this.type = type;
    switch (this.type) {
      case typeLocalStorage:
        this.callbacks = {};
        return;
      case typeWebSocket:
        this.socket = io(location.origin, {autoConnect: false});
        // this.socket.on("connect", () => console.log("connect"));
        this.socket.on('disconnect', () => {
          alert('disconnected...');
        });
        return;
    }
  }
  ready() {
    switch (this.type) {
      case typeLocalStorage:
        // 雑に全イベント発火
        for (let key in this.callbacks) {
          for (let callback of this.callbacks[key]) {
            callback(LocalStorage.getItem(key));
          }
        }
        return;
      case typeWebSocket:
        this.socket.connect();
        return;
      default:
        console.log('invalid savedata type');
        return;
    }
  }
  save(key, value) {
    switch (this.type) {
      case typeLocalStorage:
        LocalStorage.setItem(key, value);
        return;
      case typeWebSocket:
        this.socket.emit(key, value);
        return;
    }
  }
  setLoadCallback(key, callback, onlyBidirectional = false) {
    switch (this.type) {
      case typeLocalStorage:
        if (onlyBidirectional) return;
        if (!(key in this.callbacks))
          this.callbacks[key] = [callback];
        else
          this.callbacks[key].push(callback);
        return;
      case typeWebSocket:
        this.socket.on(key, callback);
        return;
    }
  }
  autoLoad(key, self) {
    // 更新があったら自動で更新するように設定
    this.setLoadCallback(key, data => {
      self[key] = data;
    })
  }
  setDefaultData(key, value) {
    switch (this.type) {
      case typeLocalStorage:
        if (localStorage.getItem(key) === null)
          LocalStorage.setItem(key, value);
        return;
    }
  }
}