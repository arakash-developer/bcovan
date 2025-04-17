const express = require("express");
const {
  handleStoreCustomer: storeCustomer,
  handleVerifyCustomer: verifyCustomer,
  handleLoginCustomer: loginCustomer,
  handleUpdateCustomer: updateCustomer,
} = require("../../../controllers/backend/customerController");

const apiPostRequestValidation = require("../../../middleware/backend/apiPostRequestValidation");

const _ = express.Router();

_.post("/store", apiPostRequestValidation, storeCustomer);
_.post("/verify", apiPostRequestValidation, verifyCustomer);
_.post("/login", apiPostRequestValidation, loginCustomer);

_.post("/update", apiPostRequestValidation, updateCustomer);

module.exports = _;
