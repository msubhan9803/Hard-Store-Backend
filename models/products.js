var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var productSchema = new mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    product_Name: { type: String, unique: true, lowercase: true },
  },
  { timestamps: true }
);

productSchema.plugin(uniqueValidator, { message: "is already taken" });
module.exports = module.exports = mongoose.model("Product", productSchema);
