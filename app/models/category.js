const mongoose = require("mongoose");
const { Schema } = mongoose;
 
const categorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    productId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    subCategoryId: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
  },
  {
    timestamps: true,
  }
);
 
// Middleware to delete related subcategories when a category is deleted
categorySchema.pre("findOneAndDelete", async function (next) {
  try {
    const categoryId = this.getQuery()._id;
    await mongoose.model("SubCategory").deleteMany({ categoryId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Category", categorySchema);
