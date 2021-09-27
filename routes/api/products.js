var router = require("express").Router();
var mongoose = require("mongoose");
var PRODUCT = require("../../models/products");
var auth = require("../auth");
var multer = require("multer");
var product_Service = require("./service/productServ");
var FAQ = require("../../models/FAQ");
var REVIEW = require("../../models/review");
var path = require("path");
const fs = require("fs-extra");
const { Router } = require("express");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
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
  const variants = await product_Service.convertToImg(req.body.variants);

  const product = new PRODUCT();
  (product.title = req.body.title),
    (product.description = req.body.description),
    (product.brand = req.body.brand),
    (product.sale = req.body.sale),
    (product.new = req.body.new),
    (product.collections = req.body.collections),
    (product.variants = variants);
  product.skuArray = req.body.skuArray;

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
  try {
    const products = await PRODUCT.find();
    if (!products) return res.status(200).send("products not found");
    return res.status(200).send(products);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/getProductById/:id", async (req, res) => {
  try {
    const isProduct = await PRODUCT.findById(req.params.id);
    if (!isProduct) return res.status(400).send("Product nor found");
    return res.status(200).send(isProduct);
  } catch (err) {
    return res.status(400).send(err);
  }
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

router.post("/productFilter", async (req, res) => {
  PRODUCT.find(
    { title: { $regex: req.body.query, $options: "i" } },
    function (err, products) {
      if (err) throw err;
      else if (docs) {
        return res.status(200).json({ result: products });
      }
    }
  ).select("title");
});

// Reviews
router.get("/getReviews", async (req, res) => {
  try {
    const review = await REVIEW.find();
    if (!review) return res.status(200).send("Reviews not found");
    return res.status(200).send(review);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.post("/writeReview", async (req, res) => {
  try {
    const isProduct = await PRODUCT.findById(req.body.ProductId);
    if (!isProduct) return res.status(400).send("Product not found");
    const review = new REVIEW();
    review.ProductId = req.body.ProductId;
    review.Name = req.body.Name;
    review.Title = req.body.Title;
    review.Email = req.body.Email;
    review.Rating = req.body.Rating;
    review.Comment = req.body.Comment;

    const savedReview = await review.save();
    if (savedReview) {
      return res.status(200).send(savedReview);
    }
  } catch (err) {
    console.log(err, "err");
    return res.status(400).send(err);
  }
});

router.get("/getReviews/:productId", async (req, res) => {
  try {
    const review = await REVIEW.find({ ProductId: req.params.productId });
    if (!review) return res.status(200).send("Reviews not found");
    return res.status(200).send(review);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/getReviewById/:id", async (req, res) => {
  try {
    const review = await REVIEW.findById(req.params.id);
    if (!review) return res.status(400).send("Review not found");
    return res.status(200).send(review);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.delete("/deleteReview/:id", async (req, res) => {
  try {
    REVIEW.deleteOne({ _id: { $eq: req.params.id } })
      .then(async (resp) => {
        if (resp) {
          return res.status(200).send("Review Deleted");
        }
      })
      .catch((err) => {
        return res.status(400).send(err);
      });
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.put("/activeSale", async (req, res) => {
  try {
    const isProduct = await PRODUCT.findById(req.body.id);
    if (!isProduct) return res.status(400).send("Product not found");
    isProduct.sale = req.body.sale;
    const updatedProduct = await isProduct.save();
    return res.status(200).send(updatedProduct);
  } catch (err) {
    return re.status(400).send(err);
  }
});

router.delete("/deleteProductImg", async (req, res) => {
  try {
    const isProduct = await PRODUCT.findById(req.body.productId);
    const imageName = isProduct.variants[0].imagesPreview[0];
    let filepath = path.join(__dirname, `../../public/uploads/${imageName}`);
    if (imageName != "") {
      fs.unlinkSync(filepath);
    }
    return res.status(200).send("Image Deleted");
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.put("/UpdateProduct", async (req, res) => {
  try {
    const isProduct = await PRODUCT.findById(req.body.productId);
    const imageName = isProduct.variants[0].imagesPreview[0];
    let filepath = path.join(__dirname, `../../public/uploads/${imageName}`);
    fs.unlinkSync(filepath);
    const variants = await product_Service.convertToImg(req.body.variants);

    (isProduct.title = req.body.title),
      (isProduct.description = req.body.description),
      (isProduct.brand = req.body.brand),
      (isProduct.sale = req.body.sale),
      (isProduct.new = req.body.new),
      (isProduct.collections = req.body.collections),
      (isProduct.variants = variants);
    isProduct.skuArray = req.body.skuArray;

    const savedProduct = await isProduct.save();
    if (savedProduct) {
      return res.status(200).send(savedProduct);
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/getProductsName", async (req, res) => {
  try {
    const productName = await PRODUCT.find().select("title");
    return res.status(200).send(productName);
  } catch (err) {
    console.log(err, "getProductsName");
    return res.status(400).send(err);
  }
});

router.get("/averageRating/:ProductId", async (req, res) => {
  try {
    const starAvg = await REVIEW.aggregate([
      {
        $match: {
          ProductId: { $eq: req.params.ProductId },
        },
      },
      {
        $group: {
          _id: req.params.ProductId,
          AverageValue: { $avg: "$Rating" },
        },
      },
    ]).exec();

    const totalReviews = await REVIEW.find({
      ProductId: req.params.ProductId,
    }).countDocuments();

    return res
      .status(200)
      .json({ totalReviews: totalReviews, starAvg: starAvg[0].AverageValue });
  } catch (err) {
    console.log(err, "averageRating");
    return res.status(400).send(err);
  }
});

//// FAQ /////
router.post("/submitFAQ", async (req, res) => {
  try {
    const faq = new FAQ();
    (faq.type = req.body.type),
      (faq.question = req.body.question),
      (faq.answer = req.body.answer);
    const savedFaq = await faq.save();
    if (savedFaq) {
      return res.status(200).send(savedFaq);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.get("/getFaqs", async (req, res) => {
  try {
    const faq = await FAQ.find();
    if (faq) {
      return res.status(200).send(faq);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.get("/getFaqsByType/:type", async (req, res) => {
  try {
    const faq = await FAQ.find({ type: req.params.type });
    return res.status(200).send(faq);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.get("/searchFaq", async (req, res) => {
  try {
    const faq = await FAQ.find({ question: { $regex: req.query.question, $options: "i" } });
    console.log("results: ", faq)
    return res.status(200).send(faq);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.put("/updateFaqById", async (req, res) => {
  try {
    var faq = await FAQ.findById(req.body.id);
    (faq.type = req.body.type),
      (faq.question = req.body.question),
      (faq.answer = req.body.answer);
    const savedFaq = await faq.save();
    if (savedFaq) {
      return res.status(200).send(savedFaq);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

router.delete("/deleteFaqById/:id", async (req, res) => {
  try {
    const faq = await FAQ.deleteOne({ _id: req.params.id });
    if (faq) {
      return res.status(200).send("FAQ Deleted");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

module.exports = router;
