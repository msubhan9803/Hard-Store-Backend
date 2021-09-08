var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var contactUsSchema = new mongoose.Schema(
  {
    Name: { type: String },
    PhoneNumber: { type: String },
    Email: { type: String },
    Message: { type: String },
  },
  { timestamps: true }
);

contactUsSchema.plugin(uniqueValidator, { message: "is already taken" });

module.exports = mongoose.model("contact", contactUsSchema);
