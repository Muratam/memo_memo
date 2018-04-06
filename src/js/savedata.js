import io from 'socket.io-client';

const typeWebSocket = 'webSocket';
const typeLocalStrage = 'localStorage';

module.exports = class SaveData {
  constructor(type) {
    this.type = type;
    switch (this.type) {
      case typeLocalStrage:
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
      case typeLocalStrage:
        // 雑に全イベント発火
        for (let key in this.callbacks) {
          for (let callback of this.callbacks[key]) {
            let value = localStorage.getItem(key);
            callback(JSON.parse(value));
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
      case typeLocalStrage:
        localStorage.setItem(key, JSON.stringify(value));
        return;
      case typeWebSocket:
        this.socket.emit(key, value);
        return;
    }
  }
  setLoadCallback(key, callback, onlyBidirectional = false) {
    switch (this.type) {
      case typeLocalStrage:
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
      case typeLocalStrage:
        if (localStorage.getItem(key) === null)
          localStorage.setItem(key, JSON.stringify(value));
        return;
    }
  }
}