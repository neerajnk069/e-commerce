const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/Ecom")
  .then(() => {
    console.log("Database is connected successfully");
  })
  .catch((error) => {
    console.log("mongobdb  is not connected", error);
  });
