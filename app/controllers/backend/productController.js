const productModel = require("../../models/product");
const brandModel = require("../../models/brand");
const categoryModel = require("../../models/category");
const subCategoryModel = require("../../models/subCategory");
const capacityModel = require("../../models/capacity");
const tagModel = require("../../models/tag");

const fs = require("node:fs");
const path = require("node:path");

const handleAllProduct = async (req, res) => {
  const allProducts = await productModel.find({}).select({
    _id: 1,
    title: 1,
  });

  if (allProducts.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: allProducts,
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

const handleAllInfoProduct = async (req, res) => {
  const allProducts = await productModel
    .find({})
    .populate({ path: "brandId", select: "_id brandName" })
    .populate({ path: "categoryId", select: "_id categoryName" })
    .populate({ path: "subcategoryId", select: "_id subCategory" })
    .populate({ path: "capacityId", select: "_id capacityName" })
    .populate({ path: "tagId", select: "_id tagName" })
    .select({
      title: 1,
      amount: 1,
      sku: 1,
      categoryId: 1,
      subcategoryId: 1,
      tagId: 1,
      brandId: 1,
      productStatus: 1,
      capacityId: 1,
      thumbnails: 1,
      imageArray: 1,
      newArrivals: 1,
    })
    .sort({ createdAt: -1 });

  if (allProducts.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: allProducts,
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

const handleViewProduct = async (req, res) => {
  const id = req.params.id;

  const productView = await productModel
    .find({ _id: id })
    .populate({ path: "brandId", select: "_id brandName" })
    .populate({ path: "categoryId", select: "_id categoryName" })
    .populate({ path: "subcategoryId", select: "_id subCategory" })
    .populate({ path: "capacityId", select: "_id capacityName" })
    .populate({ path: "tagId", select: "_id tagName" })
    .select({
      title: 1,
      shortDesc: 1,
      description: 1,
      amount: 1,
      sku: 1,
      categoryId: 1,
      subcategoryId: 1,
      tagId: 1,
      brandId: 1,
      productStatus: 1,
      capacityId: 1,
      thumbnails: 1,
      imageArray: 1,
      relatedProduct: 1,
    });

  let relatedProductData = await Promise.all(
    productView[0].relatedProduct.map(async (el) => {
      let productInfo = await productModel
        .find({ _id: el })
        .select({ _id: 1, title: 1, imageArray: 1 });

      return productInfo;
    })
  );

  // console.log("relatedProductData", relatedProductData);

  let latestProductInfo = [
    {
      title: productView[0].title,
      shortDesc: productView[0].shortDesc,
      description: productView[0].description,
      amount: productView[0].amount,
      sku: productView[0].sku,
      categoryId: productView[0].categoryId,
      subcategoryId: productView[0].subcategoryId,
      tagId: productView[0].tagId,
      brandId: productView[0].brandId,
      capacityId: productView[0].capacityId,
      thumbnails: productView[0].thumbnails,
      imageArray: productView[0].imageArray,
      relatedProduct: relatedProductData,
    },
  ];

  // console.log("latestProductInfo", latestProductInfo);

  if (productView.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: latestProductInfo,
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

const handleEditProduct = async (req, res) => {
  const id = req.params.id;

  const editProduct = await productModel
    .find({ _id: id })
    .populate({ path: "brandId", select: "_id brandName" })
    .populate({ path: "categoryId", select: "_id categoryName" })
    .populate({ path: "subcategoryId", select: "_id subCategory" })
    .populate({ path: "capacityId", select: "_id capacityName" })
    .populate({ path: "tagId", select: "_id tagName" })
    .select({
      title: 1,
      shortDesc: 1,
      description: 1,
      amount: 1,
      sku: 1,
      categoryId: 1,
      subcategoryId: 1,
      tagId: 1,
      brandId: 1,
      capacityId: 1,
      thumbnails: 1,
      imageArray: 1,
      relatedProduct: 1,
      newArrivals: 1,
    });

  if (editProduct.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: editProduct,
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

const handleStoreProduct = async (req, res) => {
  const {
    title,
    shortDesc,
    description,
    amount,
    sku,
    categoryId,
    subcategoryId,
    tagId,
    brandId,
    capacityId,
    thumbnails,
    imageArray,
    relatedProduct,
    newArrivals,
  } = req.body;

  function fileNameGenerate(originalname) {
    const fileExt = path.extname(originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName =
      originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") +
      "-";

    const imageName = fileName + uniqueSuffix + fileExt;
    return imageName;
  }

  function base64ToFile(base64Data, filePath) {
    const base64DataWithoutHeader = base64Data.replace(
      /^data:image\/\w+;base64,/,
      ""
    );
    const buffer = Buffer.from(base64DataWithoutHeader, "base64");
    fs.writeFileSync(filePath, buffer);

    return filePath;
  }

  let imageFileThumbnail = fileNameGenerate(thumbnails.imageName);
  const filePathImageThumbnail = `./public/images/${imageFileThumbnail}`;
  base64ToFile(thumbnails.imageBase64Data, filePathImageThumbnail);

  let newImageArr = imageArray.map((el) => {
    let imageFile = fileNameGenerate(el.name);
    const filePathImage = `./public/images/${imageFile}`;
    base64ToFile(el.base64, filePathImage);

    return imageFile;
  });

  let arrOfImage = [imageFileThumbnail, ...newImageArr].map((image, id) => {
    return { id: id + 1, imageURL: image };
  });

  //  console.log(imageFileThumbnail);
  //  console.log(newImageArr);
  //  console.log(arrOfImage);

  // console.log(categoryId, subcategoryId);

  // return res.send({
  //   success: {
  //     message: "Product Add Successfull.",
  //   },
  // });

  const product = new productModel({
    title,
    shortDesc,
    description,
    amount,
    sku,
    categoryId,
    subcategoryId,
    tagId,
    brandId,
    capacityId,
    thumbnails: imageFileThumbnail,
    imageArray: arrOfImage,
    relatedProduct,
    newArrivals,
  });

  let productData = await product.save();

  if (productData._id !== "") {
    //Update the brand by adding the product ID

    if (brandId) {
      await brandModel.findByIdAndUpdate(
        { _id: brandId },
        { $push: { productId: productData._id } },
        { new: true }
      );
    }

    if (capacityId) {
      await capacityModel.findByIdAndUpdate(
        { _id: capacityId },
        { $push: { productId: productData._id } },
        { new: true }
      );
    }

    await categoryModel.findByIdAndUpdate(
      { _id: categoryId },
      { $push: { productId: productData._id } },
      { new: true }
    );

    await subCategoryModel.findByIdAndUpdate(
      { _id: subcategoryId },
      { $push: { productId: productData._id } },
      { new: true }
    );

    let updateAllTags = tagId.map(async (el) => {
      await tagModel.findByIdAndUpdate(
        { _id: el._id },
        { $push: { productId: productData._id } },
        { new: true }
      );

      return "ok";
    });

    if (updateAllTags.length === tagId.length) {
      return res.send({
        success: {
          message: "Product Add Successfull.",
        },
      });
    } else {
      return res.send({
        error: {
          message: "There was an server-side Error",
        },
      });
    }
  } else {
    return res.send({
      error: {
        message: "There was an server-side Error",
      },
    });
  }
};

const handleUpdateProduct = async (req, res) => {
  const {
    id,
    title,
    shortDesc,
    description,
    amount,
    sku,
    categoryId,
    subcategoryId,
    tagId,
    brandId,
    capacityId,
    thumbnails,
    imageArray,
    relatedProduct,
    newArrivals,
  } = req.body;

  let productInfo = await productModel.find({ _id: id });
  let newArrivalsData = newArrivals ? "active" : "inactive";

  function fileNameGenerate(originalname) {
    const fileExt = path.extname(originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName =
      originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") +
      "-";

    const imageName = fileName + uniqueSuffix + fileExt;
    return imageName;
  }

  function base64ToFile(base64Data, filePath) {
    const base64DataWithoutHeader = base64Data.replace(
      /^data:image\/\w+;base64,/,
      ""
    );
    const buffer = Buffer.from(base64DataWithoutHeader, "base64");
    fs.writeFileSync(filePath, buffer);

    return filePath;
  }

  let oldImageArr = productInfo[0].imageArray.map((map) =>
    Object.fromEntries(map)
  );
  let newUpdatedImage = [...oldImageArr];

  if (thumbnails.imageName !== "") {
    let filePath = "./public/images/" + productInfo[0].thumbnails;
    fs.unlinkSync(filePath);

    let imageFileCreate = fileNameGenerate(thumbnails.imageName);
    const filePathImage = `./public/images/${imageFileCreate}`;
    base64ToFile(thumbnails.imageBase64Data, filePathImage);

    newUpdatedImage[0] = { id: 1, imageURL: imageFileCreate };
  } else {
    newUpdatedImage[0] = oldImageArr[0];
  }

  if (imageArray.length !== 0) {
    imageArray.map((el) => {
      let imageFile = fileNameGenerate(el.name);
      const filePathImage = `./public/images/${imageFile}`;
      base64ToFile(el.base64, filePathImage);

      newUpdatedImage.push({
        id: newUpdatedImage.length + 1,
        imageURL: imageFile,
      });
    });
  }

  if (brandId != productInfo[0].brandId) {
    // await brandModel.findByIdAndUpdate(
    //   { _id: brandId },
    //   { $push: { productId: productInfo[0]._id } },
    //   { new: true }
    // );

    // await brandModel.findByIdAndUpdate(
    //   { _id: productInfo[0].brandId },
    //   { $pull: { productId: productInfo[0]._id } },
    //   { new: true }
    // );

    await brandModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: brandId },
          update: { $push: { productId: productInfo[0]._id } },
        },
      },
      {
        updateOne: {
          filter: { _id: productInfo[0].brandId },
          update: { $pull: { productId: productInfo[0]._id } },
        },
      },
    ]);
  }

  if (capacityId != productInfo[0].capacityId) {
    // await capacityModel.findByIdAndUpdate(
    //   { _id: capacityId },
    //   { $push: { productId: productInfo[0]._id } },
    //   { new: true }
    // );

    // await capacityModel.findByIdAndUpdate(
    //   { _id: productInfo[0].capacityId },
    //   { $pull: { productId: productInfo[0]._id } },
    //   { new: true }
    // );

    await capacityModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: capacityId },
          update: { $push: { productId: productInfo[0]._id } },
        },
      },
      {
        updateOne: {
          filter: { _id: productInfo[0].capacityId },
          update: { $pull: { productId: productInfo[0]._id } },
        },
      },
    ]);
  }

  if (productInfo[0].categoryId) {
    if (categoryId != productInfo[0].categoryId) {
      await categoryModel.findByIdAndUpdate(
        { _id: categoryId },
        { $push: { productId: productInfo[0]._id } },
        { new: true }
      );
      await categoryModel.findByIdAndUpdate(
        { _id: productInfo[0].categoryId },
        { $pull: { productId: productInfo[0]._id } },
        { new: true }
      );
    }
  }

  if (productInfo[0].subcategoryId) {
    if (subcategoryId != productInfo[0].subcategoryId) {
      await subCategoryModel.findByIdAndUpdate(
        { _id: subcategoryId },
        { $push: { productId: productInfo[0]._id } },
        { new: true }
      );
      await subCategoryModel.findByIdAndUpdate(
        { _id: productInfo[0].subcategoryId },
        { $pull: { productId: productInfo[0]._id } },
        { new: true }
      );
    }
  }

  let newTagId = tagId.map((el) => el._id);
  let oldTagId = productInfo[0].tagId.map((el) => el.toString());
  let removedTags = oldTagId.filter((tag) => !newTagId.includes(tag));

  for (let latestTagId of newTagId) {
    await tagModel.findByIdAndUpdate(
      { _id: latestTagId },
      {
        $addToSet: { productId: productInfo[0]._id }, // Add productId only if it doesn't exist
      },
      { new: true }
    );
  }

  for (let rmTagId of removedTags) {
    await tagModel.findByIdAndUpdate(
      { _id: rmTagId },
      { $pull: { productId: productInfo[0]._id } },
      { new: true }
    );
  }

  try {
    let updatedsProductInfo = await productModel.findByIdAndUpdate(
      { _id: id },
      {
        title,
        shortDesc,
        description,
        amount,
        sku,
        categoryId,
        subcategoryId,
        tagId,
        brandId,
        capacityId,
        thumbnails: newUpdatedImage[0].imageURL,
        imageArray: newUpdatedImage,
        relatedProduct,
        newArrivals: newArrivalsData,
        productStatus: "active",
      },
      { new: true }
    );

    // console.log("oldImageArr", oldImageArr);
    // console.log("newUpdatedImage", newUpdatedImage);

    // console.log("productInfo[0].brandId", productInfo[0].brandId);
    // console.log("updatedsProductInfo", updatedsProductInfo);

    return res.send({
      success: {
        message: "Product Update Successfull.",
        data: updatedsProductInfo,
      },
    });
  } catch (error) {
    return res.send({
      error: {
        message: "There was an server-side Error",
      },
    });
  }
};

const handleDestroyProduct = async (req, res) => {
  const { id } = req.body;

  const productInfo = await productModel.find({ _id: id });
  // console.log("productInfo", productInfo);

  if (productInfo.length !== 0) {
    productInfo[0].imageArray.map((el) => {
      let filePath = "./public/images/" + el.get("imageURL");
      fs.unlinkSync(filePath);
    });

    if (productInfo[0].brandId) {
      await brandModel.findByIdAndUpdate(
        { _id: productInfo[0].brandId },
        { $pull: { productId: productInfo[0]._id } },
        { new: true }
      );
    }

    if (productInfo[0].capacityId) {
      await capacityModel.findByIdAndUpdate(
        { _id: productInfo[0].capacityId },
        { $pull: { productId: productInfo[0]._id } },
        { new: true }
      );
    }

    let updateAllTags = productInfo[0].tagId.map(async (el) => {
      await tagModel.findByIdAndUpdate(
        { _id: el },
        { $pull: { productId: productInfo[0]._id } },
        { new: true }
      );
      return "ok";
    });

    await categoryModel.findByIdAndUpdate(
      { _id: productInfo[0].categoryId },
      { $pull: { productId: productInfo[0]._id } },
      { new: true }
    );

    await subCategoryModel.findByIdAndUpdate(
      { _id: productInfo[0].subcategoryId },
      { $pull: { productId: productInfo[0]._id } },
      { new: true }
    );

    if (productInfo[0].relatedProduct) {
      await productModel.updateMany(
        { relatedProduct: { $in: [id] } },
        { $pull: { relatedProduct: productInfo[0]._id } },
        { new: true }
      );
    }

    if (updateAllTags.length === productInfo[0].tagId.length) {
      try {
        await productModel.findByIdAndDelete({ _id: id });
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
    }
  } else {
    return res.send({
      error: {
        message: "Failed to delete. Please try again.",
      },
    });
  }
};

const handleUpdateImage = async (req, res) => {
  const { id, info } = req.body;

  let filePath = "./public/images/" + info.imageURL;
  fs.unlinkSync(filePath);

  const productInfo = await productModel.find({ _id: id });

  const objectArray = productInfo[0].imageArray.map((map) =>
    Object.fromEntries(map)
  );

  let newImageArr = objectArray
    .filter((el) => el.id != info.id)
    .map((el, index) => ({ ...el, id: index + 1 }));

  try {
    await productModel.findByIdAndUpdate(
      { _id: id },
      { $set: { imageArray: newImageArr } },
      { new: true }
    );

    return res.send({
      success: {
        message: "Product Image deleted successfully!",
      },
    });
  } catch (error) {
    return res.send({
      error: {
        message: "Failed to delete. Please try again.",
      },
    });
  }
};

const handleUpdateArrival = async (req, res) => {
  const { id } = req.body;

  const productInfo = await productModel.findByIdAndUpdate(
    { _id: id },
    [
      {
        $set: {
          newArrivals: {
            $cond: [{ $eq: ["$newArrivals", "active"] }, "inactive", "active"],
          },
        },
      },
    ],
    { new: true }
  );

  // console.log("productInfo", productInfo);

  if (productInfo.length !== 0) {
    return res.send({
      success: {
        message: "Data updated successfully!",
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

module.exports = {
  handleAllProduct,
  handleAllInfoProduct,
  handleStoreProduct,
  handleUpdateProduct,
  handleUpdateImage,
  handleUpdateArrival,
  handleViewProduct,
  handleEditProduct,
  handleDestroyProduct,
};

// const productId = "67da621c59fe762ac9a2462f";

// const products = await productModel.find({
//   moreProduct: { $in: [productId] }
// });

// console.log("Matched Products:", products);

// const mongoose = require("mongoose");
// const Product = require("./models/Product"); // Adjust the path accordingly

// const updateProduct = async (productId, updateData) => {
//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(
//       productId,
//       { $set: updateData }, // Only update fields that have changed
//       { new: true, runValidators: true }
//     );
//     console.log("Updated Product:", updatedProduct);
//   } catch (error) {
//     console.error("Error updating product:", error);
//   }
// };

// // Example call
// updateProduct("PRODUCT_ID_HERE", { title: "Updated Title", additionalInfo: "New Info" });

// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   productInfo: [
//     {
//       id: { type: String, required: true },
//       title: { type: String, required: true },
//       price: { type: Number, required: true },
//       quantity: { type: Number, required: true },
//     },
//   ],
// });

// const Product = mongoose.model("Product", productSchema);

// const newProduct = new Product({
//   productInfo: [
//     {
//       id: "67e2c2911d80ea3c33f71801",
//       title: "Demo Title 1",
//       price: 100,
//       quantity: 2,
//     },
//     {
//       id: "67e2c2911d80ea3c33f79635",
//       title: "Demo Title 2",
//       price: 100,
//       quantity: 5,
//     },
//   ],
// });

// newProduct
//   .save()
//   .then(() => console.log("Data inserted successfully"))
//   .catch((err) => console.error("Error inserting data:", err));
