const mongoose = require("mongoose");
const { Schema } = mongoose;

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
      unique: true,
      required: true,
    },
    discountType: {
      type: String,
      required: true,
    },
    shippingCharge: {
      type: String,
      required: true,
    },
    discountRate: {
      type: Number,
      required: true,
    },
    minimumShopping: {
      type: Number,
      required: true,
    },
    expiredDate: {
      type: Number,
      required: true,
    },
    maximumDiscount: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
