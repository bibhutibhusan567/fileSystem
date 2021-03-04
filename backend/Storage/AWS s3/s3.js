const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

//bucket connection
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

module.exports = s3;
