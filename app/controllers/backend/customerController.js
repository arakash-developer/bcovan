const customerModel = require("../../models/customer");
const axios = require("axios");
const fs = require("node:fs");
const path = require("node:path");

const handleStoreCustomer = async (req, res) => {
  const { uname, phone } = req.body;
  const duplicatePhone = await customerModel.find({ phone });

  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  const otp = generateOTP();

  if (duplicatePhone.length == 0) {
    try {
      let options = {
        method: "POST",
        url: "https://api.sms.net.bd/sendsms",
        data: {
          api_key: "YFLJ8Nxpe2j6TYmFPyKRB1u9t7uSi8YUvO4nwd42",
          msg: `Your Seoumi SMS Verification Code is:${otp}`,
          to: `${phone}`,
        },
      };

      axios(options)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });

      const customer = new customerModel({
        phone,
        uname,
        myId: "",
        photo: "",
        phoneVerified: false,
        otpToken: otp,
      });

      await customer.save();

      return res.send({
        success: {
          message: "Data Add Successfull.",
        },
      });
    } catch (error) {
      return res.send({
        error: {
          message: `${error.message}`,
        },
      });
    }
  } else {
    return res.send({
      error: {
        message: "This Phone Number is already registered.",
      },
    });
  }
};

const handleVerifyCustomer = async (req, res) => {
  const { phone, otpCode } = req.body;
  const duplicatePhone = await customerModel.find({ phone });

  if (duplicatePhone.length !== 0 && duplicatePhone[0].otpToken === otpCode) {
    try {
      let userInfo = await customerModel.findOneAndUpdate(
        { phone: phone, otpToken: otpCode },
        {
          phoneVerified: true,
          otpToken: "",
        },
        { new: true }
      );

      const encodedData = JSON.stringify(userInfo);
      const base64Encoded = btoa(encodedData);

      return res.send({
        success: {
          message: "Data verify Successfull.",
          data: base64Encoded,
        },
      });
    } catch (error) {
      return res.send({
        error: {
          message: `${error.message}`,
        },
      });
    }
  } else {
    return res.send({
      error: {
        message: "There was an server-side Error.",
      },
    });
  }
};

const handleLoginCustomer = async (req, res) => {
  const { phone } = req.body;
  const duplicatePhone = await customerModel.find({ phone });

  if (duplicatePhone.length == 1 && duplicatePhone[0].phoneVerified === true) {
    try {
      const encodedData = JSON.stringify(duplicatePhone[0]);
      const base64Encoded = btoa(encodedData);

      return res.send({
        success: {
          message: "User Login Successfull.",
          data: base64Encoded,
        },
      });
    } catch (error) {
      return res.send({
        error: {
          message: `${error.message}`,
        },
      });
    }
  } else {
    return res.send({
      error: {
        message: "There was an server-side Error.",
      },
    });
  }
};

const handleUpdateCustomer = async (req, res) => {
  const { phone, uname, myId, photo } = req.body;
  const findID = await customerModel.find({ phone: phone });
  function fileNameGenerate(originalname) {
    const fileExt = path.extname(originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName =
      originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") +
      "-";

    const imageName = fileName + uniqueSuffix + fileExt;
    return imageName;
  }

  function base64ToFile(base64Data, filePath) {
    const base64DataWithoutHeader = base64Data.replace(
      /^data:image\/\w+;base64,/,
      ""
    );
    const buffer = Buffer.from(base64DataWithoutHeader, "base64");
    fs.writeFileSync(filePath, buffer);

    return filePath;
  }

  if (findID.length === 1) {
    let imageURL = "";

    if (photo.imageName !== "") {
      if (findID[0].photo !== "") {
        let filePath = "./public/images/" + findID[0].photo;
        fs.unlinkSync(filePath);
      }

      let imageFileCreate = fileNameGenerate(photo.imageName);
      const filePathImage = `./public/images/${imageFileCreate}`;
      base64ToFile(photo.imageBase64Data, filePathImage);

      imageURL = imageFileCreate;
    } else {
      imageURL = findID[0].photo;
    }

    let userUpdate = await customerModel.findOneAndUpdate(
      { phone: phone },
      {
        uname,
        myId,
        photo: imageURL,
      },
      { new: true }
    );

    return res.send({
      success: {
        message: "Data Update Successfull.",
        data: userUpdate,
      },
    });
  } else {
    return res.send({
      error: {
        message: "There was an server-side Error.",
      },
    });
  }
};

module.exports = {
  handleStoreCustomer,
  handleVerifyCustomer,
  handleLoginCustomer,
  handleUpdateCustomer,
};
