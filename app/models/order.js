const mongoose = require("mongoose");
const { Schema } = mongoose;
const orderSchema = new Schema(
  {
    uname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    orderNotes: {
      type: String,
    },
    shippingCharge: {
      type: String,
    },
    orderStatus: {
      type: String,
      default: "1",
    },
    shippingMethod: {
      type: String,
      required: true,
    },
    productInfo: [
      {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        required: true,
      },
    ],
    paymentGateway: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
