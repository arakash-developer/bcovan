const express = require("express");
const {
  handleAllProduct: allProduct,
  handleAllInfoProduct: allInfoProduct,
  handleStoreProduct: storeProduct,
  handleUpdateProduct: updateProduct,
  handleUpdateImage: updateImage,
  handleUpdateArrival: arrivalProduct,
  handleViewProduct: viewProduct,
  handleEditProduct: editProduct,
  handleDestroyProduct: destroyProduct,
} = require("../../../controllers/backend/productController");
const apiPostRequestValidation = require("../../../middleware/backend/apiPostRequestValidation");
const apiGetRequestValidation = require("../../../middleware/backend/apiGetRequestValidation");

const _ = express.Router();

_.get("/all",  apiGetRequestValidation, allProduct);
_.get("/allinfo",  apiGetRequestValidation, allInfoProduct);
_.post("/store", apiPostRequestValidation, storeProduct);
_.post("/update", apiPostRequestValidation, updateProduct);
_.post("/image/update", apiPostRequestValidation, updateImage);
_.post("/arrival", apiPostRequestValidation, arrivalProduct);

_.get("/view/:id", apiGetRequestValidation, viewProduct);

_.get(
  "/edit/:id",
  apiGetRequestValidation,
  editProduct
);
_.post(
  "/destroy",
  apiPostRequestValidation,
  destroyProduct
);

module.exports = _;


