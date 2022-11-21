var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

// Helpers
var storage = require('../storage');
var top = require('../helpers/top');
var footer = require('../helpers/footer');
var bottom = require('../helpers/bottom');
var clientSocket = require('../helpers/clientSocket');
var swals = require('../helpers/swals');
var closing = require('../helpers/closing');

router.get('/', (req, res) => {
  res.send(`
    ${top('File Central')}
    ${footer}
    ${bottom}
    ${closing}
  `);
});

router.get('/home', (req, res) => {
  fs.readdir(storage, (err, files) => {
    if (err) {
      return console.error(err);
    } else {
      console.log(files);
      res.send(files.toString());
      /*fs.readFile(`${storage}sample.txt`, (err, data) => {
      })*/
    }
  });
});

module.exports = router;
