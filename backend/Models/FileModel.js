const mongoose = require("mongoose");

//file schema
const fileSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  fileName: String,
  timeStamp: Number,
  date: String,
  time: String,
});

//file model
const fileModel = mongoose.model("files", fileSchema);

module.exports = fileModel;
