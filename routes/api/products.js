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
  const variants = "";
  const product = new PRODUCT();
  (product.type = req.body.type),
    (product.title = req.body.title),
    (product.description = req.body.description),
    (product.brand = req.body.brand),
    (product.collections = req.body.collections),
    (product.category = req.body.category),
    (product.sale = req.body.sale),
    (product.discount = req.body.discount),
    (product.stock = req.body.stock),
    (product.new = req.body.new),
    (product.tags = req.body.tags),
    (product.Watch_Case_Shape = req.body.Watch_Case_Shape),
    (product.Glass = req.body.Glass),
    (product.Watch_Feature = req.body.Watch_Feature),
    (product.Model = req.body.Model),
    (product.Dial_Size = req.body.Dial_Size),
    (product.Dial_Size = req.body.Dial_Size),
    (product.Watch_Case_Size = req.body.Watch_Case_Size),
    (product.Movement = req.body.Movement),
    (product.Watch_Movement_Country = req.body.Watch_Movement_Country),
    (product.Strap_Material = req.body.Strap_Material),
    (product.water_resistance = req.body.water_resistance),
    (product.Color_Family = req.body.Color_Family),
    (product.variants = variants);
  product.Warranty = req.body.Warranty;

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
