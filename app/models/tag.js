const mongoose = require("mongoose");
const { Schema } = mongoose;
const tagSchema = new Schema(
  {
    tagName: {
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
 
module.exports = mongoose.model("Tag", tagSchema);
