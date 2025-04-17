const categoryModel = require("../../models/category");
const subCategoryModel = require("../../models/subCategory");
const productModel = require("../../models/product");

const handleAllSubCategory = async (req, res) => {
  const allSubCategory = await categoryModel
    .find({})
    .populate({ path: "subCategoryId", select: "_id subCategory" })
    .sort({ categoryName: 1 });

  if (allSubCategory.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: allSubCategory,
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

const handleStoreSubCategory = async (req, res) => {
  const { subCategory, categoryId } = req.body;

  const subCategoryStore = new subCategoryModel({
    subCategory,
    categoryId,
  });

  let subCategoryData = await subCategoryStore.save();

  if (subCategoryData._id !== "") {
    await categoryModel.findByIdAndUpdate(
      { _id: categoryId },
      { $push: { subCategoryId: subCategoryData._id } },
      { new: true }
    );

    return res.send({
      success: {
        message: "SubCategory Add Successfull.",
        data: subCategoryData,
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

const handleUpdateSubCategory = async (req, res) => {
  const { id, subCatName } = req.body;

  try {
    await subCategoryModel.findByIdAndUpdate(
      { _id: id },
      { $set: { subCategory: subCatName } },
      { new: true }
    );

    return res.send({
      success: {
        message: "Data Update successfully!",
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

const handleDestroySubCategory = async (req, res) => {
  const { catId, subCatId } = req.body;

  await productModel.updateMany(
    { subcategoryId: subCatId },
    {
      $set: {
        productStatus: "inactive",
        subcategoryId: null,
      },
    }
  );

  try {
    await subCategoryModel.findByIdAndDelete({ _id: subCatId });

    await categoryModel.findByIdAndUpdate(
      { _id: catId },
      { $pull: { subCategoryId: subCatId } },
      { new: true }
    );

    return res.send({
      success: {
        message: "Data Deleted successfully!",
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
  handleAllSubCategory,
  handleStoreSubCategory,
  handleUpdateSubCategory,
  handleDestroySubCategory,
};
