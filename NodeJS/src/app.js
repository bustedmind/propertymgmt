const express = require("express");
const propertyRouter = require("./routers/properties");
require("./mongoose/db/mongoose");

//setting up the express server
const app = express();

//setting up the middlewares
app.use(express.json());

app.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "*");
  // if (req.method === "OPTIONS") {
  //   res.header("Access-Control-Allow-Methods", "GET,PATCH,POST");
  //   return res.status(200).json({error:"error"});
  // }
  next();
});

app.use(propertyRouter);

module.exports = app;
