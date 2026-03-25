require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const apiRouter = require("./route/api");

require("./db_connect");

const app = express();

app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/uploads", express.static(path.join(__dirname, "public/images")));
app.use(fileUpload());

app.use("/api", apiRouter);

app.use((req, res, next) => {
  next(createError(404, "Route Not Found"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

const http = require("http");
const server = http.createServer(app);
// socket .io
const socketHandler = require("./socket");
socketHandler(server);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

module.exports = app;
