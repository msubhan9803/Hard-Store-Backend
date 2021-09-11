var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var FAQSchema = new mongoose.Schema(
  {
    type: { type: String },
    question: { type: String, unique: true },
    answer: { type: String, unique: true },
  },
  { timestamps: true }
);

FAQSchema.plugin(uniqueValidator, { message: "is already taken" });

module.exports = mongoose.model("FAQ", FAQSchema);
