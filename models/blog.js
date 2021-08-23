var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var BlogSchema = new mongoose.Schema(
  {
    slug: { type: String },
    title: { type: String },
    imgUrl: { type: String },
    tags: [],
    description: { type: String },
  },
  { timestamps: true }
);

BlogSchema.plugin(uniqueValidator, { message: "is already taken" });

module.exports = mongoose.model("blog", BlogSchema);
