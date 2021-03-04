const multer = require("multer");

//multer storage
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, "");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//type of upload
const upload = multer({ storage }).single("file");

module.exports = upload;
