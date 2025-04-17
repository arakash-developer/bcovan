const bannerModel = require("../../models/banners");
const fs = require("node:fs");
const path = require("node:path");

const handleAllBanner = async (req, res) => {
  const allBanners = await bannerModel.find(
    {},
    {
      createdAt: 0,
      updatedAt: 0,
    }
  );

  if (allBanners.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: allBanners,
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

const handleActiveBanner = async (req, res) => {
  const allBanner = await bannerModel.find({ bannerStatus: "active" });

  if (allBanner.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: allBanner,
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

const handleStoreBanner = async (req, res) => {
  const { bannerTitle, bannerDesc, brandLogo } = req.body;

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

  const imageFile = fileNameGenerate(brandLogo.imageName);
  const filePathImage = `./public/images/${imageFile}`;
  base64ToFile(brandLogo.imageBase64Data, filePathImage);

  const banner = new bannerModel({
    bannerTitle,
    bannerImage: imageFile,
    bannerDesc,
  });

  let bannerData = await banner.save();

  if (bannerData._id !== "") {
    return res.send({
      success: {
        message: "Banner Add Successfull.",
        data: bannerData,
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

const handleStatusBanner = async (req, res) => {
  const { id } = req.body;

  const bannerUpdate = await bannerModel.findById(id);
  if (!bannerUpdate) {
    // handle not found
    return res.send({
      error: {
        message: "There was an server-side Error",
      },
    });
  }
  bannerUpdate.bannerStatus =
    bannerUpdate.bannerStatus === "active" ? "inactive" : "active";
  await bannerUpdate.save();

  if (bannerUpdate.length !== 0) {
    return res.send({
      success: {
        message: "Data updated successfully!",
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

const handleDestroyBanner = async (req, res) => {
  const { _id, imgURL } = req.body;

  const filePath = "./public/images/" + imgURL;
  fs.unlinkSync(filePath);

  try {
    await bannerModel.findByIdAndDelete({ _id: _id });
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
  handleAllBanner,
  handleActiveBanner,
  handleStoreBanner,
  handleStatusBanner,
  handleDestroyBanner,
};
