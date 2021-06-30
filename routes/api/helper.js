var handlebars = require("handlebars");
var nodemailer = require("nodemailer");
var path = require("path");
var fs = require("fs");
module.exports = {
  //   sendEmail: async function () {
  //     console.log("in function");
  //     const htmlPath = path.join(
  //       __dirname,
  //       "../Email templets/email-order-success.html"
  //     );
  //     fs.readFile(htmlPath, { encoding: "utf-8" }, function (err, html) {
  //       if (err) {
  //         throw err;
  //       } else {
  //         // callback(null, html);
  //         var template = handlebars.compile(html);
  //         var replacements = {
  //           subject: "Testing Subject",
  //           message: "yes it is Testing Subject ",
  //           redirectURL: process.env.API_Path,
  //         };
  //         var htmlToSend = template(replacements);
  //         var transporter = nodemailer.createTransport({
  //           host: process.env.HOST,
  //           port: process.env.MPORT,
  //           secure: true, // use SSL
  //           auth: {
  //             user: process.env.AUTH_USER,
  //             pass: process.env.AUTH_PASSWORD,
  //           },
  //         });
  //         var mailOptions = {
  //           from: process.env.AUTH_USER,
  //           to: "multikart@mailinator.com",
  //           subject: "Testing Subject",
  //           text: "yes it is Testing Subject ",
  //           html: htmlToSend,
  //         };
  //         transporter.sendMail(mailOptions, function (error, info) {
  //           console.log("in request");
  //           if (error) {
  //             console.log(error, "error");
  //             return error;
  //           } else {
  //             console.log("Email sent: " + info.response);
  //           }
  //         });
  //       }
  //     });
  //   },
};
