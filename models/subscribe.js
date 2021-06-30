var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var subscribeSchema = new mongoose.Schema(
  {
    Email: { type: String, lowercase: true, unique: true },
  },
  { timestamps: true }
);

subscribeSchema.plugin(uniqueValidator, { message: "is already taken" });
module.exports = mongoose.model("Subscribe", subscribeSchema);
