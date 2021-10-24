const USER = require("../../../models/users");
const nodemailer = require("nodemailer");
var handlebars = require("handlebars");
var path = require("path");
const fs = require("fs-extra");

const sendNotification = async (params) => {
  const htmlPath = path.join(__dirname, "../../EmailTemplets/emailOrder.html");

  const CC_User = ["ahsan@mailinator.com"];
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
        var replacement = {
          redirectUrl: `${process.env.FRONT_END_PATH}/trackorder/${params._id}`,
          imgURL: "http://uaeslimmers.com/uploads/deliveryimg001.png",
        };
        var htmlToSend = template(replacement);

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
          to: params.Email,
          cc: CC_User,
          subject: "Order Confirmation",
          text: "",
          html: htmlToSend,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error, "errr in mail");
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
    }
  );
};

module.exports = { sendNotification };
