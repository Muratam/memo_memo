const express = require('express');
const bodyParser = require('body-parser');
const port = 8080;
const staticPath = __dirname + '/dist';
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// 一旦 生jsonで実装 → sqlite/mysqlなど機能追加はあとで

app.post('/save', (req, res) => {
  console.log(req.body);
  res.send('');
});
app.get('/load', (req, res) => {
  res.send({hoge: 'fuga'});
});

app.use(express.static(staticPath));
app.listen(port, () => {
  console.log(`wait  : ${port}`);
  console.log(`static: ${staticPath}`);
});