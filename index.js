require("dotenv").config()

const express = require("express");
const connectdb = require("./config/connectdb");
const fileUpload= require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
const path = require("path")

const app = express();
const PORT = 3004;

 // Standard Express setup
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
  const indexRouter = require("./router/indexRouter");
const apiRouters=require("./router/productRouter");
const apiRouter = require("./router/userRouter");
  const swaggerOptions = {
    explorer: true,
    swaggerOptions: {
      urls: [
        { url: "/api", name: "User API" },
      ],
    },
  };
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));
  app.use("/", indexRouter);

app.use("/user",apiRouters);

app.use("/api", apiRouter);

connectdb.connectdb();

app.get("/", (req, res) => {
  res.send("SERVER CREATED");
});

app.listen(PORT, () => {
  console.log(`SERVER WILL BE RUNNING AT http://localhost:${PORT}/`);
});
