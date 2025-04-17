const express = require("express");
const {
  handleAllTestimonial: allTestimonial,
} = require("../../../controllers/frontend/testimonialController");
const apiGetRequestValidation = require("../../../middleware/backend/apiGetRequestValidation");

const _ = express.Router();

_.get("/all", apiGetRequestValidation, allTestimonial);

module.exports = _;
