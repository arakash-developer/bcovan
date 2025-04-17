const brandModel = require("../../models/brand");
const productModel = require("../../models/product");
const fs = require("node:fs");
const path = require("node:path");

const handleAllBrand = async (req, res) => {
  const allBrands = await brandModel.find(
    {},
    {
      createdAt: 0,
      updatedAt: 0,
    }
  );

  if (allBrands.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: allBrands,
      },
    });
  } else {
    return res.send({
      error: {
        message: "Failed to fetch Data",
      },
    });
  }
};

const handleStoreBrand = async (req, res) => {
  const { brandName, brandLogo } = req.body;

  function fileNameGenerate(originalname) {
    const fileExt = path.extname(originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName =
      originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") +
      "-";

    const imageName = fileName + uniqueSuffix + fileExt;
    return imageName;
  }

  const imageFile = fileNameGenerate(brandLogo.imageInfo.imageName);

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
  base64ToFile(brandLogo.imageBase64Data, filePathImage);

  const brand = new brandModel({
    brandName,
    brandLogo: imageFile,
  });

  let brandData = await brand.save();

  if (brandData._id !== "") {
    return res.send({
      success: {
        message: "Brand Add Successfull.",
        data: brandData,
      },
    });
  } else {
    return res.send({
      error: {
        message: "There was an server-side Error",
      },
    });
  }
};
 
const handleDestroyBrand = async (req, res) => {
  const { _id, imgURL } = req.body;

  const filePath = "./public/images/" + imgURL;
  fs.unlinkSync(filePath);
 
  await productModel.updateMany(
    { brandId: _id },
    {
      $set: {
        brandId: null,
      },
    }
  );

  try {
    await brandModel.findByIdAndDelete({ _id: _id });
    return res.send({
      success: {
        message: "Data deleted successfully!",
      },
    });
  } catch (err) {
    return res.send({
      error: {
        message: "Failed to delete. Please try again.",
      },
    });
  }
};

module.exports = {
  handleAllBrand,
  handleStoreBrand,
  handleDestroyBrand,
};
