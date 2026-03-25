const mongoose = require("mongoose");
const categoriesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: Number, enum: [0, 1], default: 0 }, // 0 = Inactive, 1 = Active
  image: { type: String },
});
module.exports = mongoose.model("Categories", categoriesSchema);
