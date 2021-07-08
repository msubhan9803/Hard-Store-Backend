var router = require("express").Router();
var mongoose = require("mongoose");
var CATEGORY = require("../../models/category");
var auth = require("../auth");

router.post("/addCategory", async (req, res) => {
  const category = new CATEGORY();
  category.category_Name = req.body.category_Name;
  try {
    const Category = await category.save();
    if (Category) {
      return res.status(200).send(Category);
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/getCategories", async (req, res) => {
  const categories = await CATEGORY.find();
  if (!categories) return res.status(200).send("Categories not found");
  else return res.status(200).send(categories);
});

module.exports = router;
