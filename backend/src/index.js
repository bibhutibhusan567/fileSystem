const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Router = require("../Routes/Router");

dotenv.config();

//middlewares

app.use(express.json());

app.use(
  cors({
    origin: process.env.ALLOW_ORIGIN,
    // origin: "*",
  })
);

app.use("/", Router);

//atlas connection
const db = mongoose
  .connect(`${process.env.DB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  });

app.listen(process.env.PORT, () =>
  console.log(`server is listening to port ${process.env.PORT}`)
);
