const tagModel = require("../../models/tag");

const handleAllTag = async (req, res) => {
  const tags = await tagModel.find({}).sort({ tagName: 1 });

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

module.exports = {
  handleAllTag,
};
