const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    uname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    phone: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    forgotToken: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
  },
  {
    timestamps: true,
  }
);
 
module.exports = mongoose.model("User", userSchema);
