const Products = require("../../../models/products");
const fs = require("fs-extra");
const path = require("path");

const convertToImg = async (params) => {
  try {
    var variants = [];
    if (params.length > 0) {
      //variants array
      await params.map((data) => {
        if (data.imagesPreview.length > 0) {
          // images array
          var images = [];
          data.imagesPreview.map((img) => {
            let base64 = img.base64.split(";base64,").pop();
            let fileName = `${Date.now()}-${img.fileName}`;
            let path = `public/products/` + fileName;
            fs.writeFile(
              path,
              base64,
              {
                encoding: "base64",
              },
              function (err) {
                if (err) {
                  console.log(err, "err file uploading");
                }
              }
            );
            images.push(fileName);
          });
        }

        var variantObj = {
          imagesPreview: images,
          isAvailable: data.isAvailable,
          isThumbnailImageIndex: data.isThumbnailImageIndex,
          variantColor: data.variantColor,
          variantIndex: data.variantIndex,
        };
        variants.push(variantObj);
      });

      return variants;
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = { convertToImg };

//  if (files.length > 0) {
// await files.map((file) => {
//     //Get Base64
//     if (file.base64 != null && file.base64 != "") {
//       let base64 = file.base64.split(";base64,").pop();
//       let path = `uploads/${Date.now()}-${file.name}`;
//       fs.writeFile(`${path}`,base64,
//         {
//           encoding: "base64",
//         },
//         function (err) {
//           if (err) {
//             console.log(err);
//           } else {
//             attachments.push({
//               attachmentTitle: file.attachmentTitle,
//               description: file.description,
//               attachmentPath: path,
//             });
//           }
//         }
//       );
//     }
//   });
// }
