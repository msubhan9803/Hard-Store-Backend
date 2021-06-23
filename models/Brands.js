var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var BrandSchema = new mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    brand_Name: { type: String, unique: true, lowercase: true },
    img_Title: { type: String, unique: true, lowercase: true },
    img_URL: { type: String, unique: true, lowercase: true },
  },
  { timestamps: true }
);

BrandSchema.plugin(uniqueValidator, { message: "is already taken" });

module.exports = mongoose.model("Brand", BrandSchema);
