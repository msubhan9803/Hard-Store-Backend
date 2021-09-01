var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var currencySchema = new mongoose.Schema(
  {
    Dollar: { type: Number },
    AED: { type: Number },
    conversionRate: { type: Number },
  },
  { timestamps: true }
);

currencySchema.plugin(uniqueValidator, { message: "is already taken" });

module.exports = mongoose.model("currency", currencySchema);
