const tagModel = require("../../models/tag");
const productModel = require("../../models/product");

const handleAllTag = async (req, res) => {
  const tags = await tagModel.find(
    {},
    {
      createdAt: 0,
      updatedAt: 0,
    }
  );

  if (tags.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: tags,
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

const handleStoreTag = async (req, res) => {
  const { title } = req.body;

  const tag = new tagModel({
    tagName: title,
  });

  let tagData = await tag.save();

  if (tagData._id !== "") {
    return res.send({
      success: {
        message: "Tag Add Successfull.",
        data: tagData,
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

const handleDestroyTag = async (req, res) => {
  const { _id } = req.body;

  await productModel.updateMany(
    { tagId: { $in: [_id] } },
    { $pull: { tagId: _id } },
    { new: true }
  );

  const productsWithoutTags = await productModel.find({
    tagId: { $exists: true, $eq: [] },
  });
 
  // Step 3: Update those products to set status inactive
  for (const product of productsWithoutTags) {
    product.productStatus = "inactive";
    await product.save();
  }

  try {
    await tagModel.findByIdAndDelete({ _id: _id });
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
  handleAllTag,
  handleStoreTag,
  handleDestroyTag,
};
