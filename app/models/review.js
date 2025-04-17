const mongoose = require("mongoose");
const { Schema } = mongoose;
 
const reviewSchema = new Schema(
  {
    uname: {
      type: String,
      required: true, 
    },
    rating: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
    },
    comment: {
      type: String,
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    reviewStatus: {
      type: String,
      default: "inactive",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
