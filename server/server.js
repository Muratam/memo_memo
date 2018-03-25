const ServerBase = require('./serverbase');
const sampleData = require('./sampledata');
const server = new ServerBase(8080, `${__dirname}/../dist`);

server.app.post('/save', (req, res) => {
  let data = req.body;
  data.count = (data.count || 0) + 1;
  console.log(data);
  const saveFileName = `${__dirname}/tempdata.json`;
  fs.writeFile(saveFileName, JSON.stringify(data));
  res.send('');
});

server.app.get('/load', (req, res) => {
  res.send(sampleData);
  // fs.readFile(sampleFileName, (err, text) => {  });
});

server.io.on('connection', (socket) => {
  console.log('new connection');
  // 接続人全員と共有は後で
  // server.io.sockets.emit('hello', 'hello!!');
  socket.on('chat', text => console.log('chat:', text));
  socket.emit('chat', {ping: 'pong'});
});


server.listen(() => {});
