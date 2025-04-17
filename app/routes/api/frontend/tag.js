const express = require("express");
const {
  handleAllTag: allTag,
} = require("../../../controllers/frontend/tagController");
const apiPostRequestValidation = require("../../../middleware/backend/apiPostRequestValidation");
const apiGetRequestValidation = require("../../../middleware/backend/apiGetRequestValidation");

const _ = express.Router();

_.get("/all", apiGetRequestValidation, allTag);

module.exports = _;
