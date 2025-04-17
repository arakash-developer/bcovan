const path = require("node:path");
const fs = require("node:fs");

const customerFromValidation = (req, res, next) => {
  const { uname, email, phone, date, subcontinents, imageObj } = req.body;

  const emailValid = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ).test(email);

  let phoneValid = new RegExp(/^01[356789]\d{8}$/).test(phone);

  if (uname === "") {
    return res.send({
      error: {
        field: "uname",
        message: "Name field is required.",
      },
    });
  } else if (email === "") {
    return res.send({
      error: {
        field: "email",
        message: "Email field is required.",
      },
    });
  } else if (!emailValid) {
    return res.send({
      error: {
        field: "email",
        message: "Your email address is Invalid.",
      },
    });
  } else if (phone === "") {
    return res.send({
      error: {
        field: "phone",
        message: "Phone field is required.",
      },
    });
  } else if (!phoneValid) {
    return res.send({
      error: {
        field: "phone",
        message: "The phone number format is incorrect.",
      },
    });
  } else if (date === "") {
    return res.send({
      error: {
        field: "date",
        message: "Date field is required.",
      },
    });
  } else if (subcontinents === "") {
    return res.send({
      error: {
        field: "subcontinents",
        message: "Subcontinents field is required.",
      },
    });
  } else {
    if (imageObj[1].imageName !== "") {
      let imageFormats = ["jpeg", "jpg", "png", "webp", "svg"];
      let checkImgFormate = imageFormats.includes(
        imageObj[1].imageType.split("/")[1]
      );

      if (!checkImgFormate) {
        return res.send({
          error: {
            field: "image",
            message: "Your file must be png, jpg, webp, jpeg and svg.",
          },
        });
      } else if (imageObj[1].imageSize >= 4194304) {
        return res.send({
          error: {
            field: "image",
            message:
              "The file size exceeds the limit. Please upload a file no larger than 4 MB.",
          },
        });
      } else if (checkImgFormate && imageObj[1].imageSize < 4194304) {
        function fileNameGenerate(originalname) {
          const fileExt = path.extname(originalname);
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const fileName =
            originalname
              .replace(fileExt, "")
              .toLowerCase()
              .split(" ")
              .join("-") + "-";

          const imageName = fileName + uniqueSuffix + fileExt;
          return imageName;
        }
        const imageFile = fileNameGenerate(imageObj[1].imageName);

        function base64ToFile(base64Data, filePath) {
          const base64DataWithoutHeader = base64Data.replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          const buffer = Buffer.from(base64DataWithoutHeader, "base64");
          fs.writeFileSync(filePath, buffer);

          return filePath;
        }

        const filePathImage = `./public/images/${imageFile}`;
        base64ToFile(imageObj[0], filePathImage);

        req.imgURL = imageFile;
        next();
      }
    } else {
      next();
    }
  }
};

module.exports = customerFromValidation;
