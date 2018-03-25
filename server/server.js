const express = require('express');
const bodyParser = require('body-parser');
const port = 8080;
const staticPath = `${__dirname}/../dist`;
const app = express();
const fs = require('fs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// 一旦 生jsonで実装 → sqlite/mysqlなど機能追加はあとで

const saveFileName = `${__dirname}/tempdata.json`;
const sampleFileName = `${__dirname}/sampledata.json`;
app.post('/save', (req, res) => {
  let data = req.body;
  data.count = (data.count || 0) + 1;
  console.log(data);
  fs.writeFile(saveFileName, JSON.stringify(data));
  res.send('');
});
app.get('/load', (req, res) => {
  fs.readFile(sampleFileName, (err, text) => {
    res.send(JSON.parse(text));
  });
});


app.use(express.static(staticPath));
app.listen(port, () => {
  console.log(`wait  : ${port}`);
  console.log(`static: ${staticPath}`);
});
