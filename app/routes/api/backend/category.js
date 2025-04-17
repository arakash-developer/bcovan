const express = require("express");
const {
  handleAllCategory: allCategory,
  handleStoreCategory: storeCategory,
  handleDestroyCategory: destroyCategory,
} = require("../../../controllers/backend/categoryController");
const apiPostRequestValidation = require("../../../middleware/backend/apiPostRequestValidation");
const apiGetRequestValidation = require("../../../middleware/backend/apiGetRequestValidation");

const _ = express.Router();

_.get("/all",  apiGetRequestValidation, allCategory);
_.post("/store", apiPostRequestValidation, storeCategory);

_.post(
  "/destroy",
  apiPostRequestValidation,
  destroyCategory
);

module.exports = _;
