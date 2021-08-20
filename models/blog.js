var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var BlogSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    title: { type: String, unique: true },
    imgUrl: { type: String },
    tags: [],
    description: { type: String },
  },
  { timestamps: true }
);

BlogSchema.plugin(uniqueValidator, { message: "is already taken" });

module.exports = mongoose.model("blog", BlogSchema);
