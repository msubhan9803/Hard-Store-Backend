var express = require("express");
var request = require("request");
var router = require("express").Router();

// Add your credentials:
// Add your client ID and secret
var CLIENT =
  "AWgt3OgWP7ItdA_tTGJNehvgTzF8ERGXHxB5ByQw-mQOrogFw6T5pf_EcoyDrfA8C4hl5LyE3HOQKpRc";
var SECRET =
  "EJZlQjRfRudOx8IZtbK-wvuATgkSfrpRkEhp6gbXcaUIxybWxsB6rhfQvoZHEEEvslR8eCxlh3nCDWTt";
var PAYPAL_API = "https://api-m.sandbox.paypal.com";

// Set up the payment:
// 1. Set up a URL to handle requests from the PayPal button
router.post("/my-api/create-payment/", function (req, res) {
  // 2. Call /v1/payments/payment to set up the payment
  request.post(
    PAYPAL_API + "/v1/payments/payment",
    {
      auth: {
        user: CLIENT,
        pass: SECRET,
      },
      body: {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        transactions: [
          {
            amount: {
              total: "5.99",
              currency: "USD",
            },
          },
        ],
        redirect_urls: {
          return_url: "https://example.com",
          cancel_url: "https://example.com",
        },
      },
      json: true,
    },
    function (err, response) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      // 3. Return the payment ID to the client
      res.json({
        id: response.body.id,
      });
    }
  );
});
// Execute the payment:
// 1. Set up a URL to handle requests from the PayPal button.
router.post("/my-api/execute-payment/", function (req, res) {
  // 2. Get the payment ID and the payer ID from the request body.
  var paymentID = req.body.paymentID;
  var payerID = req.body.payerID;
  // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
  request.post(
    PAYPAL_API + "/v1/payments/payment/" + paymentID + "/execute",
    {
      auth: {
        user: CLIENT,
        pass: SECRET,
      },
      body: {
        payer_id: payerID,
        transactions: [
          {
            amount: {
              total: "10.99",
              currency: "USD",
            },
          },
        ],
      },
      json: true,
    },
    function (err, response) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      // 4. Return a success response to the client
      res.json({
        status: "success",
      });
    }
  );
});

module.exports = router;
// Run `node ./server.js` in your terminal
