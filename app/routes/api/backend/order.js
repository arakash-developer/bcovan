const express = require("express");
const {
    handleAllOrder: allOrder,
    handleStoreOrder: storeOrder,
    handleUpdateOrder: updateOrder,
    handleDestroyOrder: destroyOrder,
} = require("../../../controllers/backend/orderController");
const apiPostRequestValidation = require("../../../middleware/backend/apiPostRequestValidation");
const apiGetRequestValidation = require("../../../middleware/backend/apiGetRequestValidation");

const _ = express.Router();

_.get("/all",  apiGetRequestValidation, allOrder);
_.post("/store", apiPostRequestValidation, storeOrder);
_.post("/update", apiPostRequestValidation, updateOrder);
_.post(
  "/destroy",
  apiPostRequestValidation,
  destroyOrder
);

module.exports = _;
