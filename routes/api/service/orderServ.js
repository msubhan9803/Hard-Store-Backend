var nodemailer = require("nodemailer");
var handlebars = require("handlebars");
var path = require("path");
const fs = require("fs-extra");

const SendMailtoCustomer = async () => {
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
        //   var replacements = {
        //     subject: savedNotification.notificationAction,
        //     message: savedNotification.notifyMessage,
        //     redirectURL: `${process.env.FRONT_END_PATH}/invoiceDetail?invoiceId=${savedNotification.notificationItem.invoiceId}&&version=${savedNotification.notificationItem.version}&&vendorId=${isInvoice.vendorId}`,
        //   };
        var htmlToSend = template();

        var transporter = nodemailer.createTransport({
          host: process.env.HOST,
          port: process.env.GPORT,
          secure: false, // use SSL
          auth: {
            user: process.env.AUTH_User,
            pass: process.env.AUTH_Password,
          },
        });
        var mailOptions = {
          from: process.env.AUTH_User,
          to: "Ahsan@mailinator.com",
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
};

module.exports = { SendMailtoCustomer };
