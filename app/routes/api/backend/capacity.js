const express = require("express");
const {
  handleAllCapacity: allCapacity,
  handleStoreCapacity: storeCapacity,
  handleDestroyCapacity: destroyCapacity,
} = require("../../../controllers/backend/capacityController");
const apiPostRequestValidation = require("../../../middleware/backend/apiPostRequestValidation");
const apiGetRequestValidation = require("../../../middleware/backend/apiGetRequestValidation");

const _ = express.Router();

_.get("/all",  apiGetRequestValidation, allCapacity);
_.post("/store", apiPostRequestValidation, storeCapacity);

_.post(
  "/destroy",
  apiPostRequestValidation,
  destroyCapacity
);

module.exports = _;
