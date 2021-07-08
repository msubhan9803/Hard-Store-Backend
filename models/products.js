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
    sale: { type: Boolean, required: true, default: false },
    discount: { type: Number, required: true },
    stock: { type: Number, required: true },
    new: { type: Boolean, required: true },
    tags: [],
    Watch_Case_Shape: { type: String },
    Glass: { type: String },
    Watch_Feature: [],
    Model: { type: String },
    Dial_Size: { type: String },
    Watch_Case_Size: { type: String },
    Movement: { type: String },
    Watch_Movement_Country: { type: String },
    Strap_Material: { type: String },
    water_resistance: { type: Boolean },
    Color_Family: [],
    variants: [
      {
        id: { type: String },
        Availability: { type: Boolean },
        Watch_Strap_Color: { type: String },
        Price: { type: Number },
        Special_Price: { type: Number },
        Quantity: { type: Number },
        images: [
          {
            isThumbnail: {
              type: Boolean,
              default: false,
            },
            image_url: { type: String },
          },
        ],
      },
    ],

    Warranty: {
      isWarranty: {
        type: Boolean,
        default: true,
      },
      warrantyPeriod: {
        type: Number,
      },
    },
    // images: [
    //   {
    //     image_id: { type: Number },
    //     id: { type: Number },
    //     alt: { type: String },
    //     img_URL: { type: String },
    //     variant_id: [],
    //   },
    // ],
  },
  { timestamps: true }
);

productSchema.plugin(uniqueValidator, { message: "is already taken" });
module.exports = module.exports = mongoose.model("Product", productSchema);
