const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    uname: {
      type: String,
      required: true,
    },
    myId: {
      type: String,
    },
    photo: String,
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    otpToken: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
