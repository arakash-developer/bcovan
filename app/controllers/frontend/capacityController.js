const capacityModel = require("../../models/capacity");

const handleAllCapacity = async (req, res) => {
  const capacity = await capacityModel.find({}).sort({ capacityName: 1 });

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

module.exports = {
  handleAllCapacity,
};
