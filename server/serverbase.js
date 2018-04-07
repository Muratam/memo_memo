export default class ServerBase {
  constructor(port = 8080, staticPath = null) {
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();
    const http = require('http').Server(app);
    // let io = require('socket.io')(http, {path: '/hogesocket'});
    const io = require('socket.io')(http);
    this.app = app;
    this.io = io;
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    if (staticPath !== null) app.use(express.static(staticPath));
    this.listen = callback => http.listen(port, () => {
      console.log(`PORT  : ${port}`);
      console.log(`STATIC: ${staticPath}`);
      if (callback) callback();
    });
  }
};