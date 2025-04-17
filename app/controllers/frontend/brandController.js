const brandModel = require("../../models/brand");

const handleAllBrand = async (req, res) => {
  const allBrands = await brandModel.find({}).sort({ brandName: 1 });

  if (allBrands.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: allBrands,
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
  handleAllBrand,
};
