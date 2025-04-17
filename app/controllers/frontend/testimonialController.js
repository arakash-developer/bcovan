const testimonialModel = require("../../models/testimonial");

const handleAllTestimonial = async (req, res) => {
  const allTestimonials = await testimonialModel
    .find({})
    .sort({ createdAt: -1 });

  if (allTestimonials.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: allTestimonials,
      },
    });
  } else {
    return res.send({
      error: {
        message: "Failed to fetch Data",
      },
    });
  }
};

module.exports = {
  handleAllTestimonial,
};
