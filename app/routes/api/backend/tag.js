const express = require("express");
const {
  handleAllTag: allTag,
  handleStoreTag: storeTag,
  handleDestroyTag: destroyTag,
} = require("../../../controllers/backend/tagController");
const apiPostRequestValidation = require("../../../middleware/backend/apiPostRequestValidation");
const apiGetRequestValidation = require("../../../middleware/backend/apiGetRequestValidation");

const _ = express.Router();

_.get("/all",  apiGetRequestValidation, allTag);
_.post("/store", apiPostRequestValidation, storeTag);

_.post(
  "/destroy",
  apiPostRequestValidation,
  destroyTag
);

module.exports = _;
