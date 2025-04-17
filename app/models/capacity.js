const mongoose = require("mongoose");
const { Schema } = mongoose;

const capacitySchema = new Schema(
  {
    capacityName: {
      type: String,
      required: true,
    },
    productId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Capacity", capacitySchema);
