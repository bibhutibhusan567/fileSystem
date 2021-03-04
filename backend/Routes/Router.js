const express = require("express");
const AWS = require("aws-sdk");
const fileModel = require("../Models/FileModel");
const upload = require("../Storage/Multer/MulterStorage");
const s3 = require("../Storage/AWS s3/s3");
const properFormat = require("../Custom Modules/properFormat");
const {
  encryptFileName,
  decryptFileName,
  decryptAndSort,
} = require("../Custom Modules/EncryptionAndDecription");

const Router = express.Router();

//add file endpoint
Router.post("/newfile", upload, async (req, res) => {
  const fileName = req.file.originalname;

  //Encrypt file Name
  const encFileName = encryptFileName(fileName);

  const getAllFiles = await fileModel.find({});

  const existingFile = getAllFiles.some(
    (file) => decryptFileName(file.fileName) === fileName
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

//get data endpoint
Router.get("/data", async (req, res) => {
  try {
    const getAllUploadedFiles = await fileModel.find({});
    console.log("inside /data", getAllUploadedFiles);
    console.log("sorted order", decryptAndSort(getAllUploadedFiles));
    res.send(decryptAndSort(getAllUploadedFiles));
  } catch (error) {
    res.send({ error: error });
  }
});

//download endpoint
Router.get("/download/:fileName", async (req, res) => {
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

//delete endpoint
Router.delete("/delete/:id", async (req, res) => {
  const _id = req.params.id;
  const getFile = await fileModel.findById({ _id });
  const fileName = decryptFileName(getFile.fileName);

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

//testing endpoint
Router.get("/", (req, res) => {
  res.send("welcome to db,db is working");
});

module.exports = Router;
