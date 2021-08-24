const USER = require("../../../models/users");
const nodemailer = require("nodemailer");
var handlebars = require("handlebars");
var path = require("path");
const fs = require("fs-extra");

const sendNotification = async () => {
  const htmlPath = path.join(
    __dirname,
    "../../EmailTemplets/email-order-success.html"
  );

  fs.readFile(
    htmlPath,
    {
      encoding: "utf-8",
    },
    function (err, html) {
      if (err) {
        throw err;
      } else {
        // callback(null, html);
        var template = handlebars.compile(html);

        var htmlToSend = template();

        var transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.G_PORT,
          secure: true, // use SSL
          auth: {
            user: process.env.AUTH_USER,
            pass: process.env.AUTH_PASS,
          },
        });
        var mailOptions = {
          from: process.env.AUTH_USER,
          to: "ahsanzulfiqar77@gmail.com",
          subject: "test",
          text: "test",
          html: htmlToSend,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
    }
  );

  //   var transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: process.env.G_PORT,
  //     secure: true, // use SSL
  //     auth: {
  //       user: process.env.AUTH_USER,
  //       pass: process.env.AUTH_PASS,
  //     },
  //   });

  //   var mailOptions = {
  //     from: process.env.AUTH_USER,
  //     to: "ahsanzulfiqar77@gmail.com",
  //     subject: "TEST mAIL ",
  //     text: "CHECKING TEST mAIL",
  //     html: "<p> All saves  </p>",
  //   };

  //   transporter.sendMail(mailOptions, function (error, info) {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log("Email sent: " + info.response);
  //     }
  //   });
};

module.exports = { sendNotification };
