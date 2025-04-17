const express = require("express");
const {
  handleAllCategory: allCategory,
} = require("../../../controllers/frontend/categoryController");
const apiPostRequestValidation = require("../../../middleware/backend/apiPostRequestValidation");
const apiGetRequestValidation = require("../../../middleware/backend/apiGetRequestValidation");

const _ = express.Router();

_.get("/all", apiGetRequestValidation, allCategory);

module.exports = _;




