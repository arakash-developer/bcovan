const reviewModel = require("../../models/review");
const productModel = require("../../models/product");
const fs = require("node:fs");
const path = require("node:path");

const handleAllReview = async (req, res) => {
  const allReviews = await reviewModel
    .find({})
    .populate({ path: "productId", select: "_id title" })
    .sort({ createdAt: -1 });

  if (allReviews.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: allReviews,
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

const handleStoreReview = async (req, res) => {
  const { uname, rating, photo, comment, productId, reviewStatus } = req.body;

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

  let photoName = "";

  if (photo.imageName !== "") {
    const imageFile = fileNameGenerate(photo.imageName);
    const filePathImage = `./public/images/${imageFile}`;
    base64ToFile(photo.imageBase64Data, filePathImage);
    photoName = imageFile;
  }

  const review = new reviewModel({
    uname,
    rating,
    photo: photoName,
    comment,
    productId,
    reviewStatus,
  });

  let reviewData = await review.save();

  if (reviewData._id !== "") {
    await productModel.findByIdAndUpdate(
      { _id: productId },
      { $push: { reviewId: reviewData._id } },
      { new: true }
    );

    return res.send({
      success: {
        message: "Review Add Successfull.",
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

const handleStoreReviewTwo = async (req, res) => {
  const { uname, rating, photo, comment, productId } = req.body;

  const review = new reviewModel({
    uname,
    rating,
    photo,
    comment,
    productId,
  });

  let reviewData = await review.save();

  if (reviewData._id !== "") {
    await productModel.findByIdAndUpdate(
      { _id: productId },
      { $push: { reviewId: reviewData._id } },
      { new: true }
    );

    return res.send({
      success: {
        message: "Review Add Successfull.",
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

const handleReviewUpdate = async (req, res) => {
  const { id, rating, photo, photoUrl, comment } = req.body;

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

  let photoName = "";

  if (photo.imageName !== "") {
    if (photoUrl !== "") {
      const filePath = "./public/images/" + photoUrl;
      fs.unlinkSync(filePath);
    }
    const imageFile = fileNameGenerate(photo.imageName);
    const filePathImage = `./public/images/${imageFile}`;
    base64ToFile(photo.imageBase64Data, filePathImage);
    photoName = imageFile;
  } else {
    photoName = photoUrl;
  }

  let updatedReview = await reviewModel.findByIdAndUpdate(
    { _id: id },
    {
      rating,
      photo: photoName,
      comment,
    },
    { new: true }
  );

  if (updatedReview._id !== "") {
    return res.send({
      success: {
        message: "Review Update Successfull.",
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

const handleEditReview = async (req, res) => {
  const allReviews = await reviewModel.find({ _id: req.body.id });

  if (allReviews.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: allReviews,
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

const handleReviewStatus = async (req, res) => {
  const { id } = req.body;

  const reviewUpdate = await reviewModel.findById(id);
  if (!reviewUpdate) {
    // handle not found
    return res.send({
      error: {
        message: "There was an server-side Error",
      },
    });
  }
  reviewUpdate.reviewStatus =
    reviewUpdate.reviewStatus === "active" ? "inactive" : "active";
  await reviewUpdate.save();

  if (reviewUpdate.length !== 0) {
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

const handleDestroyReview = async (req, res) => {
  const { id, imgURL, productId } = req.body;

  if (imgURL !== "") {
    const filePath = "./public/images/" + imgURL;
    fs.unlinkSync(filePath);
  }

  await productModel.findByIdAndUpdate(
    { _id: productId },
    { $pull: { reviewId: id } },
    { new: true }
  );

  try {
    await reviewModel.findByIdAndDelete({ _id: id });
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
  handleAllReview,
  handleStoreReview,
  handleStoreReviewTwo,
  handleEditReview,
  handleReviewUpdate,
  handleReviewStatus,
  handleDestroyReview,
};
