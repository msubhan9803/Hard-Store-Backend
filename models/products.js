var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var productSchema = new mongoose.Schema(
  {
    type: { type: String, lowercase: true, required: true }, // Men || Women
    title: { type: String, required: true },
    description: { type: String, lowercase: true, required: true },
    brand: {
      brand_id: { type: String, required: true },
      brand_Name: { type: String, required: true },
    },
    collections: [], //  new products, tranding , on sale
    category: {
      category_id: { type: String, required: true },
      category_Name: { type: String, required: true },
    },
    price: { type: Number, required: true },
    sale: { type: Boolean, required: true, default: false },
    discount: { type: Number, required: true },
    stock: { type: Number, required: true },
    new: { type: Boolean, required: true },
    tags: [],
    variants: [
      {
        variant_id: { type: Number },
        id: { type: Number },
        sku: { type: String },
        size: { type: String },
        color: { type: String },
        image_id: { type: Number },
      },
    ],
    images: [
      {
        image_id: { type: Number },
        id: { type: Number },
        alt: { type: String },
        img_URL: { type: String },
        variant_id: [],
      },
    ],
  },
  { timestamps: true }
);

productSchema.plugin(uniqueValidator, { message: "is already taken" });
module.exports = module.exports = mongoose.model("Product", productSchema);
