var storage = require('./storage');
var multer = require('multer');
const store = (staff) => {
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${storage}${staff}/`)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname;
      cb(null, req.body.staff + '-' + uniqueSuffix)
    }
  })
};

const upload = (staff) => {
  return multer({ storage: store(staff) });
};

module.exports = upload;