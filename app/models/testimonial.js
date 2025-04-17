const mongoose = require("mongoose");
const { Schema } = mongoose;

const testimonialSchema = new Schema(
  {
    uname: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
    },
    testimonial: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
