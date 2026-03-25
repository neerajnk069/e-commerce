const mongoose = require("mongoose");
const subCategoriesSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
  subcategoryname: { type: String, required: true },
  status: { type: Number, enum: [0, 1], default: 0 }, //  o = Inactive, 1 = Active,
});
module.exports = mongoose.model("subCategories", subCategoriesSchema);
