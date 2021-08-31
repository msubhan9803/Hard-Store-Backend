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

router.get("/requestAccessTokenPaypal", async (req, res) => {
  var headers = {
    Accept: "application/json",
    "Accept-Language": "en_US",
  };

  var dataString = "grant_type=client_credentials";

  var options = {
    url: process.env.PAYPAL_TOKEN,
    method: "POST",
    headers: headers,
    body: dataString,
    auth: {
      user: process.env.PAYPAL_CLIENT_ID,
      pass: process.env.PAYPAL_SECRET,
    },
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const jsonBody = JSON.parse(body);
      return res.status(200).json(jsonBody);
    }
  }
  request(options, callback);
});

router.post("/my-server/create-order", function (req, res) {
  request.post(
    process.env.PAYPAL_CREATE_ORDER,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.body.access_token}`,
        "PayPal-Partner-Attribution-Id": "FLAVORsb-diayg6242989_MP",
      },
      body: {
        intent: "CAPTURE",
        purchase_units: req.body.purchase_units,
      },
      json: true,
    },
    function (err, response, body) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.json({
        id: body,
      });
    }
  );
});

// router.post("/my-server/handle-approve/:id", function (req, res) {
//   var OrderID = req.params.id;
//   request.post(
//     process.env.PAYPAL_HANDLE_APPROVE + OrderID + "/capture",
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${req.body.access_token}`,
//         "PayPal-Partner-Attribution-Id": "FLAVORsb-diayg6242989_MP",
//       },
//     },
//     function (err, response, body) {
//       console.log(response);
//       if (err) {
//         console.error(err);
//         return res.status(500).send(err);
//       }
//       const result = JSON.parse(body);
//       res.json({
//         result: result,
//       });
//     }
//   );
// });

// Set up the payment:
// 1. Set up a URL to handle requests from the PayPal button
router.post("/my-api/create-payment/", function (req, res) {
  // 2. Call /v1/payments/payment to set up the payment
  console.log("n body");
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
