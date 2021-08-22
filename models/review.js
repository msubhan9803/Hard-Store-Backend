var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var ReviewSchema = new mongoose.Schema(
  {
    ProductId: { type: String, unique: false },
    Name: { type: String, unique: false },
    Title: { type: String, unique: false },
    Email: { type: String, unique: false },
    Comment: { type: String, unique: false },
  },
  { timestamps: true }
);

ReviewSchema.plugin(uniqueValidator, { message: "is already taken" });

module.exports = mongoose.model("review", ReviewSchema);
