const productModel = require("../../models/product");
const reviewModel = require("../../models/review");

// const handleAllProduct = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Default page 1
//     const dataview = parseInt(req.query.dataview) || 1; // Default dataview 10
//     const skip = (page - 1) * dataview;

//     const allProducts = await productModel
//       .find({ productStatus: "active" })
//       .populate({ path: "brandId", select: "_id brandName" })
//       .populate({ path: "categoryId", select: "_id categoryName" })
//       .populate({ path: "capacityId", select: "_id capacityName" })
//       .populate({ path: "tagId", select: "_id tagName" })
//       .select({
//         title: 1,
//         shortDesc: 1,
//         amount: 1,
//         categoryId: 1,
//         tagId: 1,
//         brandId: 1,
//         capacityId: 1,
//         thumbnails: 1,
//       })
//       .sort({ createdAt: -1 })
//       .skip(skip) // Pagination
//       .limit(dataview); // Pagination

//     let countProduct = await productModel.countDocuments({
//       productStatus: "active",
//     });

//     if (allProducts.length > 0) {
//       return res.send({
//         success: {
//           message: "Data Fetch Successfull.",
//           data: {
//             products: allProducts,
//             count: countProduct,
//             page,
//             dataview,
//             totalPages: Math.ceil(countProduct / dataview),
//             hasNextPage: page * dataview < countProduct,
//             hasPrevPage: page > 1,
//           },
//         },
//       });
//     } else {
//       return res.send({
//         error: {
//           message: "Failed to fetch Data",
//         },
//       });
//     }
//   } catch (error) {
//     return res.status(500).send({
//       error: {
//         message: "Internal Server Error",
//         details: error.message,
//       },
//     });
//   }
// };

const handleAllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page 1
    const dataview = parseInt(req.query.dataview) || 1; // Default dataview 10
    const skip = (page - 1) * dataview;

    // Step 1: Get all products with .populate()
    const allProducts = await productModel
      .find({ productStatus: "active" })
      .populate({ path: "brandId", select: "_id brandName" })
      .populate({ path: "categoryId", select: "_id categoryName" })
      .populate({ path: "capacityId", select: "_id capacityName" })
      .populate({ path: "tagId", select: "_id tagName" })
      .select({
        title: 1,
        shortDesc: 1,
        amount: 1,
        categoryId: 1,
        tagId: 1,
        brandId: 1,
        capacityId: 1,
        thumbnails: 1,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(dataview);

    // Step 2: Get average ratings from Review collection
    const productIds = allProducts.map((p) => p._id);

    const ratings = await reviewModel.aggregate([
      {
        $match: {
          productId: { $in: productIds },
          reviewStatus: "active",
        },
      },
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    // Step 3: Map productId -> averageRating
    const ratingMap = {};
    ratings.forEach((r) => {
      ratingMap[r._id.toString()] = {
        averageRating: parseFloat(r.averageRating.toFixed(1)),
        totalReviews: r.totalReviews,
      };
    });

    // Step 4: Merge rating into product data
    const finalProducts = allProducts.map((product) => {
      const ratingInfo = ratingMap[product._id.toString()] || {
        averageRating: 0,
        totalReviews: 0,
      };

      return {
        ...product.toObject(),
        averageRating: ratingInfo.averageRating,
        totalReviews: ratingInfo.totalReviews,
      };
    });

    let countProduct = await productModel.countDocuments({
      productStatus: "active",
    });

    if (allProducts.length > 0) {
      return res.send({
        success: {
          message: "Data Fetch Successfull.",
          data: {
            products: finalProducts,
            count: countProduct,
            page,
            dataview,
            totalPages: Math.ceil(countProduct / dataview),
            hasNextPage: page * dataview < countProduct,
            hasPrevPage: page > 1,
          },
        },
      });
    } else {
      return res.send({
        error: {
          message: "Failed to fetch Data",
        },
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: {
        message: "Internal Server Error",
        details: error.message,
      },
    });
  }
};

const handleCategoryProduct = async (req, res) => {
  try {
    const allProducts = await productModel
      .find({ productStatus: "active", categoryId: req.body.id })
      .populate({ path: "brandId", select: "_id brandName" })
      .populate({ path: "categoryId", select: "_id categoryName" })
      .populate({ path: "capacityId", select: "_id capacityName" })
      .populate({ path: "tagId", select: "_id tagName" })
      .select({
        title: 1,
        shortDesc: 1,
        amount: 1,
        categoryId: 1,
        tagId: 1,
        brandId: 1,
        capacityId: 1,
        thumbnails: 1,
      })
      .sort({ createdAt: -1 });

    // Step 2: Get average ratings from Review collection
    const productIds = allProducts.map((p) => p._id);

    const ratings = await reviewModel.aggregate([
      {
        $match: {
          productId: { $in: productIds },
          reviewStatus: "active",
        },
      },
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    // Step 3: Map productId -> averageRating
    const ratingMap = {};
    ratings.forEach((r) => {
      ratingMap[r._id.toString()] = {
        averageRating: parseFloat(r.averageRating.toFixed(1)),
        totalReviews: r.totalReviews,
      };
    });

    // Step 4: Merge rating into product data
    const finalProducts = allProducts.map((product) => {
      const ratingInfo = ratingMap[product._id.toString()] || {
        averageRating: 0,
        totalReviews: 0,
      };

      return {
        ...product.toObject(),
        averageRating: ratingInfo.averageRating,
        totalReviews: ratingInfo.totalReviews,
      };
    });

    if (allProducts.length > 0) {
      return res.send({
        success: {
          message: "Data Fetch Successfull.",
          data: finalProducts,
        },
      });
    } else {
      return res.send({
        error: {
          message: "Failed to fetch Data",
        },
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: {
        message: "Internal Server Error",
        details: error.message,
      },
    });
  }
};

const handleSubCategoryProduct = async (req, res) => {
  try {
    const allProducts = await productModel
      .find({ productStatus: "active", subcategoryId: req.body.id })
      .populate({ path: "brandId", select: "_id brandName" })
      .populate({ path: "categoryId", select: "_id categoryName" })
      .populate({ path: "capacityId", select: "_id capacityName" })
      .populate({ path: "tagId", select: "_id tagName" })
      .select({
        title: 1,
        shortDesc: 1,
        amount: 1,
        categoryId: 1,
        tagId: 1,
        brandId: 1,
        capacityId: 1,
        thumbnails: 1,
      })
      .sort({ createdAt: -1 });

    // Step 2: Get average ratings from Review collection
    const productIds = allProducts.map((p) => p._id);

    const ratings = await reviewModel.aggregate([
      {
        $match: {
          productId: { $in: productIds },
          reviewStatus: "active",
        },
      },
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    // Step 3: Map productId -> averageRating
    const ratingMap = {};
    ratings.forEach((r) => {
      ratingMap[r._id.toString()] = {
        averageRating: parseFloat(r.averageRating.toFixed(1)),
        totalReviews: r.totalReviews,
      };
    });

    // Step 4: Merge rating into product data
    const finalProducts = allProducts.map((product) => {
      const ratingInfo = ratingMap[product._id.toString()] || {
        averageRating: 0,
        totalReviews: 0,
      };

      return {
        ...product.toObject(),
        averageRating: ratingInfo.averageRating,
        totalReviews: ratingInfo.totalReviews,
      };
    });

    if (allProducts.length > 0) {
      return res.send({
        success: {
          message: "Data Fetch Successfull.",
          data: finalProducts,
        },
      });
    } else {
      return res.send({
        error: {
          message: "Failed to fetch Data",
        },
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: {
        message: "Internal Server Error",
        details: error.message,
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
    .populate({ path: "reviewId" })
    .populate({ path: "capacityId", select: "_id capacityName" })
    .populate({ path: "tagId", select: "_id tagName" })
    .select({
      title: 1,
      shortDesc: 1,
      description: 1,
      amount: 1,
      sku: 1,
      reviewId: 1,
      categoryId: 1,
      tagId: 1,
      brandId: 1,
      capacityId: 1,
      imageArray: 1,
      relatedProduct: 1,
    });

  // Step 2: Calculate average rating for this product
  const ratingResult = await reviewModel.aggregate([
    {
      $match: {
        productId: productView[0]._id,
        reviewStatus: "active",
      },
    },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const ratingInfo = ratingResult[0] || { averageRating: 0, totalReviews: 0 };

  let relatedProductData = await Promise.all(
    productView[0].relatedProduct.map(async (el) => {
      let productInfo = await productModel
        .find({ _id: el })
        .select({ _id: 1, title: 1, amount: 1, thumbnails: 1 });

      return productInfo[0];
    })
  );

  let latestProductInfo = [
    {
      title: productView[0].title,
      shortDesc: productView[0].shortDesc,
      description: productView[0].description,
      amount: productView[0].amount,
      sku: productView[0].sku,
      reviewId: productView[0].reviewId,
      categoryId: productView[0].categoryId,
      tagId: productView[0].tagId,
      brandId: productView[0].brandId,
      capacityId: productView[0].capacityId,
      imageArray: productView[0].imageArray,
      relatedProduct: relatedProductData,
      averageRating: parseFloat(ratingInfo.averageRating.toFixed(1)),
      totalReviews: ratingInfo.totalReviews,
    },
  ];

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

module.exports = {
  handleAllProduct,
  handleCategoryProduct,
  handleSubCategoryProduct,
  handleViewProduct,
};
