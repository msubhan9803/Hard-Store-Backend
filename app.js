var http = require("http"),
  path = require("path"),
  methods = require("methods"),
  express = require("express"),
  bodyParser = require("body-parser"),
  session = require("express-session"),
  cors = require("cors"),
  mongoose = require("mongoose");
errorhandler = require("errorhandler");
dotenv = require("dotenv");

// const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("./swagger.json");

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

dotenv.config();

var isProduction = process.env.NODE_ENV === "production";

// Create global app object
var app = express();

app.use(cors());
app.use(express.json({ limit: "50MB", extended: true }));
app.use(express.urlencoded({ limit: "50mb" }));
// app.use(express.bodyParser());

// Normal express config defaults
app.use(require("morgan")("dev"));
// app.use(
//   bodyParser.urlencoded({
//     limit: "50mb",
//     extended: true,
//     parameterLimit: 1000000,
//   })
// );
// app.use(bodyParser.json({ limit: "50mb" }));

app.use(require("method-override")());
app.use(express.static(path.join(__dirname, "public/products")));
app.use(express.static(path.join(__dirname, "public/uploads")));

app.use(cors());
app.use(function (req, res, next) {
  //  res.header("Access-Control-Allow-Origin", "http://192.168.1.100:8025"); // update to match the domain you will make the request from
  res.header("Access-Control-Expose-Headers", "cooljwt");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(
  session({
    secret: "conduit",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);

if (!isProduction) {
  app.use(errorhandler());
}

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} else {
  mongoose.connect("mongodb://localhost/conduit");
  mongoose.set("debug", true);
}

require("./models/category");
require("./models/Brands");
require("./models/products");
require("./models/order");
require("./models/blog");
app.use(require("./routes"));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

// finally, let's start our server...
var server = app.listen(process.env.PORT || 7777, function () {
  console.log("Listening on port " + server.address().port);
});
