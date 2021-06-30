var router = require("express").Router();

router.use("/", require("./User"));
router.use("/category", require("./Category"));
router.use("/brand", require("./Brands"));
router.use("/products", require("./Products"));
router.use("/order", require("./Orders"));

router.use(function (err, req, res, next) {
  if (err.name === "ValidationError") {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function (errors, key) {
        errors[key] = err.errors[key].message;
        return errors;
      }, {}),
    });
  }
  return next(err);
});

module.exports = router;
