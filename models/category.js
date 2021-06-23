var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var CategorySchema = new mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    category_Name: { type: String, unique: true, lowercase: true },
    sub_category_Name: [],
  },
  { timestamps: true }
);

CategorySchema.plugin(uniqueValidator, { message: "is already taken" });
module.exports = mongoose.model("Category", CategorySchema);
