const express = require('express');
const path = require('path');
const app = express();

app.get('/online', (req, res) => {
  res.send('online');
});

app.use('/', express.static(path.resolve('./demo')));
app.use('/libs', express.static(path.resolve('./libs')));

const http = require('http');
http.createServer(app).listen(8080);
