var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
var secret = require("../configs").secret;

var userSchema = new mongoose.Schema(
  {
    display_Name: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    email: { type: String, unique: true, lowercase: true, required: true },
    contact_Number: { type: String, unique: true, required: true },
    role: { type: String, required: true },
    profile_Image: { type: String },
    hash: { type: String },
    salt: { type: String },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator, { message: "is already taken" });

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

userSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

userSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      display_name: this.display_name,
      email: this.email,
      role: this.role,
      contact_Number: this.contact_Number,
      profile_Image: this.profile_Image,
      exp: parseInt(exp.getTime() / 1000),
    },
    secret
  );
};

userSchema.methods.toAuthJSON = function () {
  return {
    display_Name: this.display_Name,
    email: this.email,
    contact_Number: this.contact_Number,
    role: this.role,
    profile_Image: this.profile_Image,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model("User", userSchema);
