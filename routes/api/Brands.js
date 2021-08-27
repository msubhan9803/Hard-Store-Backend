var router = require("express").Router();
var BRAND = require("../../models/Brands");
var multer = require("multer");
var path = require("path");

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

router.post("/addBrand", upload.single("brandImg"), async (req, res) => {
  const brand = new BRAND();
  if (!req.file) {
    return res.status(400).json("Please select an image to upload");
  }

  if (!req.file.originalname.match(/\.(png)$/)) {
    return res.status(404).json("Only PNG image type are allowed");
  }

  var file = req.file;

  (brand.brand_Name = req.body.brand_Name),
    (brand.slug = req.body.slug),
    (brand.img_URL = `${process.env.Image_Path}/uploads/brands/${file.filename}`),
    (brand.img_Title = file.filename);

  try {
    const Brand = await brand.save();
    if (Brand) {
      return res.status(200).send(Brand);
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/getBrands", async (req, res) => {
  const brands = await BRAND.find();
  if (!brands) return res.status(400).send("Brand not found");
  else return res.status(200).send(brands);
});

router.put("/updateBrand", upload.single("brandImg"), async (req, res) => {
  const isBrand = await BRAND.findById(req.body.brand_id);
  if (!isBrand) return res.status(400).send("Brand not found");
  if (!req.file) {
    (isBrand.brand_Name = req.body.brand_Name), (isBrand.slug = req.body.slug);
    isBrand
      .save()
      .then((result) => {
        return res.status(200).send(result);
      })
      .catch((err) => {
        return res.status(400).send(err);
      });
  } else {
    console.log("in else");
    if (!req.file.originalname.match(/\.(png)$/)) {
      return res.status(400).json("Only PNG image type are allowed");
    }

    var file = req.file;
    (isBrand.brand_Name = req.body.brand_Name),
      (isBrand.slug = req.body.slug),
      (isBrand.img_URL = `${process.env.Image_Path}/uploads/brands/${file.filename}`),
      (isBrand.img_Title = file.filename);

    try {
      const Brand = await isBrand.save();
      if (Brand) {
        return res.status(200).send(Brand);
      }
    } catch (err) {
      return res.status(400).send(err);
    }
  }
});

module.exports = router;
