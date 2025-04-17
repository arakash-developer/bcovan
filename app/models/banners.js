const mongoose = require("mongoose");
const { Schema } = mongoose;

const bannerSchema = new Schema(
  {
    bannerTitle: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
      required: true,
    },
    bannerDesc: {
      type: String,
      required: true,
    },
    bannerStatus: {
      type: String,
      default: "inactive",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Banner", bannerSchema);
