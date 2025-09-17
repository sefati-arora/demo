require("dotenv").config()

const express = require("express");
const connectdb = require("./config/connectdb");
const fileUpload= require("express-fileupload");
const app = express();
const PORT = 3004;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
const apiRouter = require("./router/userRouter");
const apiRoute=  require('./router/productRouter');
app.use("/api", apiRouter);

connectdb.connectdb();

app.get("/", (req, res) => {
  res.send("SERVER CREATED");
});

app.listen(PORT, () => {
  console.log(`SERVER WILL BE RUNNING AT http://localhost:${PORT}/`);
});
