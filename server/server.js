const ServerBase = require('./serverbase');
const sampleData = require('./sampledata');
const fs = require('fs');
const server = new ServerBase(8080, `${__dirname}/../dist`);
const saveFileName = `${require('os').homedir()}/.memomemo.json`;


// contentsデータを全て書き換える
function updateContents(contents) {
  let savedData = loadDataSync();
  savedData.contents = contents;
  fs.writeFile(saveFileName, JSON.stringify(savedData, null, '  '));
}
function updateGenres(genres) {
  let savedData = loadDataSync();
  savedData.genres = genres;
  fs.writeFile(saveFileName, JSON.stringify(savedData, null, '  '));
}

function loadDataSync() {
  try {
    let data = fs.readFileSync(saveFileName, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.log('###ERROR###', err);
    return sampleData;
  }
}


server.io.on('connection', (socket) => {
  console.log('new connection');
  socket.on('contents', updateContents);
  socket.on('genres', updateGenres);
  let emitData = loadDataSync();
  socket.emit('contents', emitData.contents);
  socket.emit('genres', emitData.genres);
  socket.emit('hows', emitData.hows);
  // 接続全員と共有は後で
  // server.io.sockets.emit('hello', 'hello!!');
});


server.listen(() => {});
