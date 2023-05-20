const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api");
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));


app.use("/api", apiRoutes);

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://qhuydev:1Qu3suVc1hEEdi6d@cluster0.dek5hts.mongodb.net/quanlydoanhnghiem?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB is ready");

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDB error: ${err}`);
  });
