const util = require("util");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../upload`));
  },
  filename: (req, file, callback) => {
    var filename = `${file.originalname}`; 
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage }).array("multi-files", 50);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;