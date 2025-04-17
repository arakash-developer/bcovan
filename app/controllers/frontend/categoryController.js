const categoryModel = require("../../models/category");

const handleAllCategory = async (req, res) => {
  const categories = await categoryModel.find({})
  .populate({
    path: "subCategoryId",
    select: "_id subCategory",
  })
  .select({
    categoryName: 1,
    productId: 1,
    subCategoryId: 1,
  })
  .sort({ categoryName: 1 });
  
  
  if (categories.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: categories,
      },
    });
  } else {
    return res.send({
      error: {
        message: "Failed to fetch Data.",
      },
    });
  }
}; 

module.exports = {
  handleAllCategory,
};
