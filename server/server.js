const ServerBase = require('./serverbase');
const sampleData = require('./sampledata');
const fs = require('fs');
const server = new ServerBase(8080, `${__dirname}/../dist`);
const saveFileName = `${__dirname}/tempdata.json`;


// contentsデータを全て書き換える
function updateContents(contents) {
  let savedData = loadDataSync();
  savedData.contents = contents;
  fs.writeFile(saveFileName, JSON.stringify(savedData));
}
/* // WARN: idを指定して一部操作系は後ほど？
  function findIndexById(contents, id) {
    for (let i = 0; i < contents.length; i++) {
      if (contents[i].id === id) return i
    }
    return null;
  }
  function updateContent(content) {
    let savedData = loadDataSync();
    let index = findIndexById(savedData.contents, content.id);
    if (index === null) return;
    savedData.contents[index] = content;
    fs.writeFile(saveFileName, JSON.stringify(savedData));
  }
  function getContent(id) {
    let savedData = loadDataSync();
    let index = findIndexById(savedData.contents, id);
    if (index === null) return null;
    return savedData.contents[index];
  }
*/

function loadDataSync() {
  try {
    let data = fs.readFileSync(saveFileName, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return sampleData;
  }
}


server.io.on('connection', (socket) => {
  console.log('new connection');
  socket.emit('init', loadDataSync());
  socket.on('update-contents', updateContents);
  socket.on('get-contents', _ => {
    socket.emit('set-contents', loadDataSync().contents);
  });
  /* // idを指定して一部操作系
    socket.on('update-content', updateContent);
    socket.on('get-content', id => {
      let content = getContent(id);
      if (content === null) return;
      socket.emit('set-content', content);
    });
  */
  // 接続全員と共有は後で
  // server.io.sockets.emit('hello', 'hello!!');
});


server.listen(() => {});
