const express = require("express");
const {
  handleAllReview: allReview,
  handleStoreReview: storeReview,
  handleStoreReviewTwo: storeReviewTwo,
  handleEditReview: editReview,
  handleReviewStatus: reviewStatus,
  handleReviewUpdate: reviewUpdate,
  handleDestroyReview: destroyReview,
} = require("../../../controllers/backend/reviewController");
const apiPostRequestValidation = require("../../../middleware/backend/apiPostRequestValidation");
const apiGetRequestValidation = require("../../../middleware/backend/apiGetRequestValidation");

const _ = express.Router();
 
_.get("/all",  apiGetRequestValidation, allReview);
_.post("/store", apiPostRequestValidation, storeReview);
_.post("/storebyuser", apiPostRequestValidation, storeReviewTwo);
_.post("/edit", apiPostRequestValidation, editReview);
_.post("/status", apiPostRequestValidation, reviewStatus);
_.post("/update", apiPostRequestValidation, reviewUpdate);

_.post(
  "/destroy",
  apiPostRequestValidation,
  destroyReview
);

module.exports = _;
