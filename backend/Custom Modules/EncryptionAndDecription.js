const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");

dotenv.config();

//encryption function
const encryptFileName = (val) =>
  CryptoJS.AES.encrypt(val, process.env.SECRET_KEY).toString();

//decription function
const decryptFileName = (val) => {
  const bytes = CryptoJS.AES.decrypt(val, process.env.SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

//sort the objects
const decryptAndSort = (uploadedFiles) => {
  const decryptedObject = uploadedFiles.map((item) => {
    //Decrypt originalName
    const originalName = decryptFileName(item.fileName);

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

module.exports = {
  encryptFileName,
  decryptFileName,
  decryptAndSort,
};
