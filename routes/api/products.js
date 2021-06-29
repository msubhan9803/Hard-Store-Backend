var router = require("express").Router();
var mongoose = require("mongoose");
var PRODUCT = require("../../models/products");
var auth = require("../auth");
var multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/products");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

router.post("/addProduct", async (req, res) => {
  console.log("in request ");

  const product = new PRODUCT();
  (product.type = req.body.type),
    (product.title = req.body.title),
    (product.description = req.body.description),
    (product.brand = req.body.brand),
    (product.collections = req.body.collections),
    (product.category = req.body.category),
    (product.price = req.body.price),
    (product.sale = req.body.sale),
    (product.discount = req.body.discount),
    (product.stock = req.body.stock),
    (product.new = req.body.new),
    (product.tags = req.body.tags),
    (product.variants = req.body.variants),
    (product.images = req.body.images);
  console.log(product);

  try {
    const savedProduct = await product.save();
    if (savedProduct) {
      return res.status(200).send(savedProduct);
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/getProducts", async (req, res) => {
  const products = await PRODUCT.find();
  if (!products) return res.status(200).send("products not found");
  else return res.status(200).send(products);
});

router.delete("/deleteProduct", async (req, res) => {
  try {
    PRODUCT.deleteOne({ _id: { $eq: req.body.product_Id } })
      .then((resp) => {
        if (resp) {
          return res.status(200).send("Product Deleted");
        }
      })
      .catch((err) => {
        return res.status(400).send(err);
      });
  } catch (err) {
    return res.status(400).send(err);
  }
});

module.exports = router;
