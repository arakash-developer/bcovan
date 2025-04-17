const categoryModel = require("../../models/category");
const productModel = require("../../models/product");

const handleAllCategory = async (req, res) => {
  const categories = await categoryModel
    .find({})
    .populate({
      path: "subCategoryId",
      select: "_id subCategory",
    })
    .select({
      categoryName: 1,
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
        message: "Failed to fetch Data",
      },
    });
  }
};

const handleStoreCategory = async (req, res) => {
  const { title } = req.body;

  const category = new categoryModel({
    categoryName: title,
  });

  let categoryData = await category.save();

  if (categoryData._id !== "") {
    return res.send({
      success: {
        message: "Category Add Successfull.",
        data: categoryData,
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
 
const handleDestroyCategory = async (req, res) => {
  const { _id } = req.body;

  await productModel.updateMany(
    { categoryId: _id },
    {
      $set: {
        productStatus: "inactive",
        categoryId: null,
        subcategoryId: null,
      },
    }
  );

  try {
    await categoryModel.findOneAndDelete({ _id: _id });
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
  handleAllCategory,
  handleStoreCategory,
  handleDestroyCategory,
};


