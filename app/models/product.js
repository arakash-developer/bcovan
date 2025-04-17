const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subcategoryId: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      default: null,
    },
    tagId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },
    capacityId: {
      type: Schema.Types.ObjectId,
      ref: "Capacity",
      default: null,
    },
    reviewId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    thumbnails: {
      type: String,
      required: true,
    },
    imageArray: [
      {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        required: true,
      },
    ],
    relatedProduct: [
      {
        type: String,
      },
    ],
    newArrivals: {
      type: String,
      default: "inactive",
    },
    productStatus: {
      type: String,
      default: "active",
    },
    wishlistId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Wishlist",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
