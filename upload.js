var storage = require('./storage');
var multer = require('multer');
const store = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, storage)
    },
    filename: function (req, file, cb) {
      cb(null, properName(file.originalname))
    }
  });

const upload = multer({ storage: store });

function properName(filename) {
  let format = filename.split('.').pop();
  filename = filename.split(`.${format}`)[0];
  return `${format}-${Date.now()}-${filename.replace(/[^A-Za-z0-9]/g, '_')}.${format}`;
}

module.exports = upload;