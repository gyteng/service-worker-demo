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

const appLB1 = express();
appLB1.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , Cookie');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
appLB1.get('/loadBalance/data', (req, res) => {
  if(Math.random() > 0.5) {
    return res.send('Hello world from 8081');
  }
  return res.status(404).end();
});
http.createServer(appLB1).listen(8081);

const appLB2 = express();
appLB2.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , Cookie');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
appLB2.get('/loadBalance/data', (req, res) => {
  if(Math.random() > 0.5) {
    return res.send('Hello world from 8082');
  }
  return res.status(404).end();
});
http.createServer(appLB2).listen(8082);

if(process.argv[2]) {
  const open = require('open');
  open('http://localhost:8080/' + process.argv[2]);
}
