const mongoose = require("mongoose");
const cmsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: Number,
    Comment: "1 for about-us , 2 for Privacy-policy, 3 for Terms & Condition ",
  },
});
module.exports = mongoose.model("Cms", cmsSchema);
