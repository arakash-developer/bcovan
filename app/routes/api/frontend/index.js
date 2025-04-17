const express = require("express");
const _ = express.Router();
const categoryRoutes = require("./category");
const brandRoutes = require("./brand");
const capacityRoutes = require("./capacity");
const tagRoutes = require("./tag");
const productRoutes = require("./product");
const testimonialRoutes = require("./testimonial");

_.use("/category", categoryRoutes);
_.use("/brand", brandRoutes);
_.use("/capacity", capacityRoutes);
_.use("/tag", tagRoutes);
_.use("/product", productRoutes);
_.use("/testimonial", testimonialRoutes);

module.exports = _;
