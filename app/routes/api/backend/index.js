const express = require("express");
const _ = express.Router();
const authenticationRoutes = require("./authentication");
const customerRoutes = require("./customer");
const brandRoutes = require("./brand");
const categoryRoutes = require("./category");
const tagRoutes = require("./tag");
const capacityRoutes = require("./capacity");
const subcategoryRoutes = require("./subcategory");
const productRoutes = require("./product");
const orderRoutes = require("./order");
const couponRoutes = require("./coupon");
const testimonialRoutes = require("./testimonial");
const reviewRoutes = require("./review");
const bannerRoutes = require("./banner");

_.use("/authentication", authenticationRoutes);
_.use("/customer", customerRoutes);
_.use("/brand", brandRoutes);
_.use("/category", categoryRoutes);
_.use("/tag", tagRoutes);
_.use("/capacity", capacityRoutes);
_.use("/subcategory", subcategoryRoutes);
_.use("/product", productRoutes);
_.use("/order", orderRoutes);
_.use("/coupon", couponRoutes);
_.use("/testimonial", testimonialRoutes);
_.use("/review", reviewRoutes);
_.use("/banner", bannerRoutes);

module.exports = _;


