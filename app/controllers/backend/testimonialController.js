const testimonialModel = require("../../models/testimonial");
const fs = require("node:fs");
const path = require("node:path");

const handleAllTestimonial = async (req, res) => {
  const allTestimonials = await testimonialModel.find(
    {},
    {
      createdAt: 0,
      updatedAt: 0,
    }
  ).sort({ createdAt: -1 });

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

const handleStoreTestimonial = async (req, res) => {
  const { uname, photo, testimonial, designation } = req.body;

    function fileNameGenerate(originalname) {
      const fileExt = path.extname(originalname);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName =
        originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") +
        "-";

      const imageName = fileName + uniqueSuffix + fileExt;
      return imageName;
    }

    const imageFile = fileNameGenerate(photo.imageInfo.imageName);

    function base64ToFile(base64Data, filePath) {
      const base64DataWithoutHeader = base64Data.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      const buffer = Buffer.from(base64DataWithoutHeader, "base64");
      fs.writeFileSync(filePath, buffer);

      return filePath;
    }

    const filePathImage = `./public/images/${imageFile}`;
    base64ToFile(photo.imageBase64Data, filePathImage);


//   console.log(uname, photo, testimonial, designation);
  

//   return res.send({
//     success: {
//       message: "Testimonial Add Successfull.",
//     },
//   });

  const testimonialAdd = new testimonialModel({
    uname,
    photo: imageFile,
    testimonial,
    designation,
  });

  let testimonialData = await testimonialAdd.save();

  if (testimonialData._id !== "") {
    return res.send({
      success: {
        message: "Testimonial Add Successfull.",
        data: testimonialData,
      },
    });
  } else {
    return res.send({
      error: {
        message: "There was an server-side Error",
      },
    });
  }
};

const handleDestroyTestimonial = async (req, res) => {
  const { _id, imgURL } = req.body;

  const filePath = "./public/images/" + imgURL;
  fs.unlinkSync(filePath);

  try {
    await testimonialModel.findByIdAndDelete({ _id: _id });
    return res.send({
      success: {
        message: "Data deleted successfully!",
      },
    });
  } catch (err) {
    return res.send({
      error: {
        message: "Failed to delete. Please try again.",
      },
    });
  }
};

module.exports = {
  handleAllTestimonial,
  handleStoreTestimonial,
  handleDestroyTestimonial,
};
