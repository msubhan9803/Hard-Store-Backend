var router = require("express").Router();
var mongoose = require("mongoose");
var USER = require("../../models/users");
var multer = require("multer");
var path = require("path");
var AUTH = require("../auth");
var SUBSCRIBE = require("../../models/subscribe");
const jwt = require("jsonwebtoken");
var CURRENCY = require("../../models/currency");
const CONTACT = require("../../models/contactUs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

router.post("/saveUser", async (req, res) => {
  try {
    const user = new USER();
    user.display_Name = req.body.display_Name;
    user.email = req.body.email;
    user.contact_Number = req.body.contact_Number;
    user.role = req.body.role;
    user.setPassword(req.body.password);

    const saved_User = await user.save();
    if (saved_User) {
      return res.status(200).json({ user: saved_User.toAuthJSON() });
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

router.post("/userLogin", async (req, res) => {
  USER.findOne({ email: { $eq: req.body.email } })
    .then((user) => {
      if (!user || !user.validPassword(req.body.password)) {
        return res.status(400).json({ message: "Invalid email or password" });
      } else {
        return res.status(200).json({ user: user.toAuthJSON() });
      }
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
});

router.put(
  "/uploadProfile",
  AUTH,
  upload.single("profile"),
  async (req, res) => {
    const isUser = await USER.findById(req.user.id);
    if (!isUser) return res.status(400).send("Invalid User");

    if (!req.file) {
      return res.status(400).json("Please select an image to upload");
    }
    var file = req.file;
    if (
      !req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)
    ) {
      return res.status(404).json("Only image type are allowed");
    }

    USER.updateOne(
      { _id: { $eq: req.user.id } },
      {
        $set: {
          profile_Image: `${process.env.API_Path}/uploads/${file.filename}`,
        },
      }
    )
      .exec()
      .then((resp) => {
        return res.status(200).send(resp);
      })
      .catch((err) => {
        return res.status(400).send(err);
      });
  }
);

router.post("/subscribe", async (req, res) => {
  const subscribe = new SUBSCRIBE();
  const isSubscriber = await SUBSCRIBE.findOne({
    Email: { $eq: req.body.email },
  });
  if (isSubscriber) return res.status(400).send("Already Subscribed");
  subscribe.Email = req.body.email;
  subscribe.save().then((resp) => {
    return res.status(200).send("Subscribed");
  });
});

router.post("/addCurrency", async (req, res) => {
  try {
    const currency = new CURRENCY();
    (currency.Dollar = 1), (currency.AED = req.body.AED);
    const conversionRate = currency.Dollar / currency.AED;
    currency.conversionRate = conversionRate;

    const savedCurrency = await currency.save();
    return res.status(200).send(savedCurrency);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.put("/updateCurrency", async (req, res) => {
  try {
    const currency = await CURRENCY.findOne();
    currency.AED = req.body.AED;
    const conversionRate = currency.Dollar / currency.AED;
    currency.conversionRate = conversionRate;

    const savedCurrency = await currency.save();
    return res.status(200).send(savedCurrency);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/getCurrency", async (req, res) => {
  const isCurrency = await CURRENCY.findOne();
  console.log(isCurrency, "isCurrency");
  return res.status(200).send(isCurrency);
});

router.post("/contactUs", async (req, res) => {
  const contactUs = new CONTACT();
  try {
    contactUs.Name = req.body.Name;
    contactUs.PhoneNumber = req.body.PhoneNumber;
    contactUs.Email = req.body.Email;
    contactUs.Message = req.body.Message;
    const savedMessage = await contactUs.save();
    return res.status(200).send("Thanks for contacting us");
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/getContactMessages", async (req, res) => {
  try {
    const getMessages = await CONTACT.find();
    return res.status(200).send(getMessages);
  } catch (err) {
    return res.status(400).send(err);
  }
});

module.exports = router;
