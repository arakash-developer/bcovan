const express = require("express");
const {
  handleAllProduct: allProduct,
  handleCategoryProduct: categoryProduct,
  handleSubCategoryProduct: subCategoryProduct,
  handleViewProduct: viewProduct,
} = require("../../../controllers/frontend/productController");
const apiPostRequestValidation = require("../../../middleware/backend/apiPostRequestValidation");
const apiGetRequestValidation = require("../../../middleware/backend/apiGetRequestValidation");

const _ = express.Router();

_.get("/all", apiGetRequestValidation, allProduct);
_.post("/category", apiPostRequestValidation, categoryProduct);
_.post("/subcategory", apiPostRequestValidation, subCategoryProduct);
_.get("/view/:id", apiGetRequestValidation, viewProduct);

module.exports = _;
