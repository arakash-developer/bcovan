const capacityModel = require("../../models/capacity");
const productModel = require("../../models/product");

const handleAllCapacity = async (req, res) => {
  const capacity = await capacityModel.find(
    {},
    {
      createdAt: 0,
      updatedAt: 0,
    }
  );

  if (capacity.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: capacity,
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

const handleStoreCapacity = async (req, res) => {
  const { title } = req.body;

  const capacity = new capacityModel({
    capacityName: title,
  });

  let capacityData = await capacity.save();

  if (capacityData._id !== "") {
    return res.send({
      success: {
        message: "Capacity Add Successfull.",
        data: capacityData,
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

const handleDestroyCapacity = async (req, res) => {
  const { _id } = req.body;
   
  await productModel.updateMany(
    { capacityId: _id },
    {
      $set: {
        capacityId: null,
      },
    }
  );

  try {
    await capacityModel.findByIdAndDelete({ _id: _id });
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
  handleAllCapacity,
  handleStoreCapacity,
  handleDestroyCapacity,
};
