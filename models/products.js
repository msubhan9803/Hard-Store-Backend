var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var productSchema = new mongoose.Schema(
  {
    // type: { type: String, lowercase: true, required: false }, // Men || Women
    title: { type: String, required: false },
    description: { type: String, lowercase: true, required: false },
    // category_id: { type: String, required: false },
    brand: { type: String, required: false },
    // collections: [], //  new products, tranding , on sale
    sale: { type: Boolean, required: false, default: false },
    new: { type: Boolean, required: false },
    tags: [],
    // Watch_Case_Shape: { type: String },
    // Watch_Case_Size: { type: String },
    // Glass: { type: String },
    // Watch_Feature: [],
    // Model: { type: String },
    // Dial_Size: { type: String },
    // Movement: { type: String },
    // Watch_Movement_Country: { type: String },
    // Strap_Material: { type: String },
    // water_resistance: { type: Boolean },
    // Color_Family: [],
    // Warranty: {
    //   isWarranty: {
    //     type: Boolean,
    //     default: true,
    //   },
    //   warrantyPeriod: {
    //     type: Number,
    //   },
    // },
    variants: [
      {
        imagesPreview: [],
        isAvailable: { type: Boolean },
        isThumbnailImageIndex: { type: Number },
        variantColor: { type: String },
        variantIndex: { type: Number },
      },
    ],

    skuArray: [
      {
        variantIndex: { type: Number },
        freeItems: { type: String },
        watchStrapColor: { type: String },
        price: { type: String },
        specialPrice: { type: String },
        stock: { type: String },
        sellerSku: { type: String },
      },
    ],
  },
  { timestamps: true }
);

productSchema.plugin(uniqueValidator, { message: "is already taken" });
module.exports = module.exports = mongoose.model("Product", productSchema);
