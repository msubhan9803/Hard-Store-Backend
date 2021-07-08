var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var CategorySchema = new mongoose.Schema(
  {
    category_Name: { type: String, unique: true, lowercase: true },
  },
  { timestamps: true }
);

CategorySchema.plugin(uniqueValidator, { message: "is already taken" });
module.exports = mongoose.model("Category", CategorySchema);
