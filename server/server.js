const ServerBase = require('./serverbase');
const sampleData = require('./sampledata');
const fs = require('fs');
const server = new ServerBase(8080, `${__dirname}/../dist`);
const saveFileName = `${__dirname}/tempdata.json`;


function updateContent(preData, data) {
  let {genre, how, content} = data;
  let {id} = content;
  delete content.id;
  if (!(genre in preData.contents)) preData.contents[genre] = {};
  if (!(how in preData.contents[genre])) preData.contents[genre][how] = {};
  preData.contents[genre][how][id] = content;
  fs.writeFile(saveFileName, JSON.stringify(preData));
}
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
  socket.on('update-content', data => {
    updateContent(loadDataSync(), data);
  });
  // 接続全員と共有は後で
  // server.io.sockets.emit('hello', 'hello!!');
});


server.listen(() => {});
