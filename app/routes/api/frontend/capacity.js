const express = require("express");
const {
  handleAllCapacity: allCapacity,
} = require("../../../controllers/frontend/capacityController");
const apiPostRequestValidation = require("../../../middleware/backend/apiPostRequestValidation");
const apiGetRequestValidation = require("../../../middleware/backend/apiGetRequestValidation");

const _ = express.Router();

_.get("/all",apiGetRequestValidation, allCapacity);

module.exports = _;
