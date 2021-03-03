const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const CryptoJS = require("crypto-js");
const { enc } = require("crypto-js");
const AWS = require("aws-sdk");

dotenv.config();
app.use(express.json());

app.use(
  cors({
    origin: process.env.ALLOW_ORIGIN,
  })
);

//atlas connection
const db = mongoose
  .connect(`${process.env.DB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  });

//file schema
const fileSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  fileName: String,
  timeStamp: Number,
  date: String,
  time: String,
});

//model
const fileModel = mongoose.model("files", fileSchema);

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

//bucket connection
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

//helper function
const properFormat = (val) => {
  if (val > 9) return val;
  return `0${val}`;
};

//encryption function
const encryptName = (val) =>
  CryptoJS.AES.encrypt(val, process.env.SECRET_KEY).toString();

//decription function
const decryptName = (val) => {
  const bytes = CryptoJS.AES.decrypt(val, process.env.SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

//sort the objects
const decryptAndSort = (uploadedFiles) => {
  const decryptedObject = uploadedFiles.map((item) => {
    //Decrypt originalName
    const originalName = decryptName(item.fileName);

    return {
      id: item._id,
      fileName: originalName,
      timeStamp: item.timeStamp,
      date: item.date,
      time: item.time,
    };
  });

  const sortedOrder = decryptedObject.sort((a, b) => b.timeStamp - a.timeStamp);
  return sortedOrder;
};

//all api endpoints

app.post("/newfile", upload, async (req, res) => {
  const fileName = req.file.originalname;

  //Encrypt file Name
  const encFileName = encryptName(fileName);

  const getAllFiles = await fileModel.find({});

  const existingFile = getAllFiles.some(
    (file) => decryptName(file.fileName) === fileName
  );

  if (existingFile) {
    res.send({
      error: `${fileName} already exist,Please choose different file to upload !!!`,
    });
  } else {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
    };
    s3.upload(params, async (error, data) => {
      if (error) {
        res.send({ error });
      }
      const newDate = new Date();
      const years = newDate.getFullYear();
      const days = newDate.getDate();
      const months = newDate.getMonth() + 1;
      const hours = newDate.getHours();
      const hourFormat = hours <= 12 ? hours : hours - 12;
      const minutes = newDate.getMinutes();
      const seconds = newDate.getSeconds();
      const amOrpm = hours < 12 ? "am" : "pm";

      const dateString = `${properFormat(days)}/${properFormat(
        months
      )}/${properFormat(years)}`;
      const timeString = `${properFormat(hourFormat)}${amOrpm}:${properFormat(
        minutes
      )}:${properFormat(seconds)}`;

      const obj = {
        fileName: encFileName,
        timeStamp: newDate,
        date: dateString,
        time: timeString,
      };

      const newFile = new fileModel(obj);
      await newFile.save();
      const getAllUploadedFiles = await fileModel.find({});

      res.send({
        message: `${fileName} uploaded successfully`,
        body: decryptAndSort(getAllUploadedFiles),
      });
    });
  }
});

app.get("/data", async (req, res) => {
  try {
    const getAllUploadedFiles = await fileModel.find({});
    console.log("inside /data", getAllUploadedFiles);
    console.log("sorted order", decryptAndSort(getAllUploadedFiles));
    res.send(decryptAndSort(getAllUploadedFiles));
  } catch (error) {
    res.send({ error: error });
  }
});

app.get("/download/:fileName", async (req, res) => {
  const fileName = req.params.fileName;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  };

  s3.getObject(params, async (error, data) => {
    if (error) {
      res.send({ error });
    }
    console.log(data.Body.toString("utf-8"));
    res.send(data.Body.toString("utf-8"));
  });
});

app.get("/delete/:id", async (req, res) => {
  const _id = req.params.id;
  const getFile = await fileModel.findById({ _id });
  const fileName = decryptName(getFile.fileName);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  };

  //delete object fron bucket
  s3.deleteObject(params, async (error, data) => {
    if (error) {
      res.send({ error });
    }
    //delete object details from atlas
    await fileModel.deleteOne({ _id }).catch((error) => res.send(error));

    const getAllUploadedFiles = await fileModel.find({});

    res.send({
      body: decryptAndSort(getAllUploadedFiles),
      message: `${fileName} deleted successfully`,
    });
  });
});

app.get("/", (req, res) => {
  res.send("welcome to db,db is working");
});

app.listen(process.env.PORT, () =>
  console.log(`server is listening to port ${process.env.PORT}`)
);
