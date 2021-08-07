var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var orderSchema = new mongoose.Schema(
  {
    first_Name: { type: String, lowercase: true },
    last_Name: { type: String, lowercase: true },
    phone: { type: String },
    Email: { type: String, lowercase: true },
    Country: { type: String, lowercase: true },
    City: { type: String, lowercase: true },
    State: { type: String, lowercase: true },
    postalCode: { type: String, lowercase: true },
    Address: { type: String, lowercase: true },
    products: [
      {
        product_name: {
          type: String,
          require: true,
        },
        product_Id: {
          type: String,
          require: true,
        },
        unit_Cost: {
          type: Number,
          require: true,
        },
        quantity: {
          type: Number,
          require: true,
        },
        discount: {
          type: Number,
          require: true,
        },
        amount: {
          type: Number,
          require: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      require: true,
    },

    tracking_Status: {
      current_Status: {
        type: String,
      },
      order_Confirmed: {
        date: {
          type: Date,
        },
        comment: {
          type: String,
        },
        status: {
          type: String,
        },
      },
      ready_for_Delivery: {
        date: {
          type: Date,
        },
        comment: {
          type: String,
          default: "",
        },
        status: {
          type: String,
        },
      },
      out_For_Delivery: {
        date: {
          type: Date,
        },
        comment: {
          type: String,
          default: "",
        },
        status: {
          type: String,
        },
      },
      delivered: {
        date: {
          type: Date,
        },
        comment: {
          type: String,
          default: "",
        },
        status: {
          type: String,
        },
      },
      Paid: {
        date: {
          type: Date,
        },
        comment: {
          type: String,
          default: "",
        },
        status: {
          type: String,
        },
      },
    },
  },
  { timestamps: true }
);

orderSchema.plugin(uniqueValidator, { message: "is already taken" });
module.exports = mongoose.model("Order", orderSchema);
