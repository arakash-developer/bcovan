const express = require("express");
const {
  handleAllTestimonial: allTestimonial,
  handleStoreTestimonial: storeTestimonial,
  handleDestroyTestimonial: destroyTestimonial,
} = require("../../../controllers/backend/testimonialController");
const apiPostRequestValidation = require("../../../middleware/backend/apiPostRequestValidation");
const apiGetRequestValidation = require("../../../middleware/backend/apiGetRequestValidation");

const _ = express.Router();

_.get("/all",  apiGetRequestValidation, allTestimonial);
_.post("/store", apiPostRequestValidation, storeTestimonial);

_.post(
  "/destroy",
  apiPostRequestValidation,
  destroyTestimonial
);

module.exports = _;
