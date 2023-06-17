const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config()
const route = require("./src/routes/route");
const app = express();

app.use(express.json());
app.use(multer().any());


mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("Database Connected successfully..."))
    .catch((error) => console.log(error));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
    console.log("Express app running on Port 3000")
})
