const ServerBase = require('./serverbase');
const sampleData = require('./sampledata');
const fs = require('fs');
const server = new ServerBase(8080, `${__dirname}/../dist`);
const saveFileName = `${__dirname}/tempdata.json`;


function updateContents(preData, data) {
  let {genre, how, contents} = data;
  if (!(genre in preData.contents)) preData.contents[genre] = {};
  if (!(how in preData.contents[genre])) preData.contents[genre][how] = [];
  preData.contents[genre][how] = contents;
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

function getContents(genre, how, savedData) {
  let res = [];
  if (genre === 0) {
    if (how === 0) {
      for (let g in savedData) {
        for (let h in savedData[g]) {
          Array.prototype.push.apply(res, savedData[g][h]);
        }
      }
    } else {
      for (let g in savedData) {
        Array.prototype.push.apply(res, savedData[g][how]);
      }
    }
  } else if (how === 0) {
    let genres = (genre in savedData) ? savedData[genre] : {};
    for (let h in genres) {
      Array.prototype.push.apply(res, genres[h]);
    }
  } else {
    res = (genre in savedData) ? savedData[genre] : {};
    res = (how in res) ? res[how] : [];
  }
  return res;
}

server.io.on('connection', (socket) => {
  console.log('new connection');
  // .{genres[{name,id}],hows[{name,id}],contents{{[{id,body,url,title}]}}}
  socket.emit('init', loadDataSync());
  // data{genre,how,contents{id,body,url,title}}
  socket.on('update-contents', data => {
    updateContents(loadDataSync(), data);
  });
  socket.on('get-contents', data => {
    let {genre, how} = data;
    let savedData = loadDataSync().contents;
    let contents = getContents(genre, how, savedData);
    socket.emit('set-contents', {genre: genre, how: how, contents: contents});
  });
  // 接続全員と共有は後で
  // server.io.sockets.emit('hello', 'hello!!');
});


server.listen(() => {});
