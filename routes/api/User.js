var router = require("express").Router();
var mongoose = require("mongoose");
var USER = require("../../models/users");
var multer = require("multer");
var path = require("path");
var AUTH = require("../auth");
var SUBSCRIBE = require("../../models/subscribe");

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

module.exports = router;
