const couponModel = require("../../models/coupon");

const handleAllCoupon = async (req, res) => {
  const allCoupons = await couponModel.find({}).sort({ createdAt: -1 });

  if (allCoupons.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: allCoupons,
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

const handleStoreCoupon = async (req, res) => {
  const {
    couponCode,
    discountType,
    shippingCharge,
    discountRate,
    minimumShopping,
    expiredDate,
    maximumDiscount,
  } = req.body;

  const coupon = new couponModel({
    couponCode,
    discountType,
    shippingCharge,
    discountRate,
    minimumShopping,
    expiredDate,
    maximumDiscount,
  });

  let couponData = await coupon.save();

  if (couponData._id !== "") {
    return res.send({
      success: {
        message: "Coupon Add Successfull.",
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

const handleCheckCoupon = async (req, res) => {
  const { couponCode, amount, shippingCharge } = req.body;
  
  const couponInfo = await couponModel.find({ couponCode });

  if (couponInfo.length > 0) {
    if (couponInfo[0].expiredDate >= Date.now()) {
      if (couponInfo[0].minimumShopping <= amount) {
        if (couponInfo[0].discountType == "Fixed") {
          let discountPrice =
            couponInfo[0].shippingCharge == "Include" ? shippingCharge : 0;

          let amountTotal = (amount - couponInfo[0].discountRate) + discountPrice;

          let infoObject = {
            shippingCharge:
              couponInfo[0].shippingCharge == "Include"
                ? `${shippingCharge}`
                : "Free",
            totalAmount: amount + shippingCharge,
            discountAmount: `${couponInfo[0].discountRate}`,
            amount: amountTotal,
            couponExpired: false,
          };

          return res.send({
            success: {
              message: "Data Fetch Successfull.",
              data: infoObject,
            },
          });
        } else {
          let result = (couponInfo[0].discountRate / 100) * amount;
          let roundedResult = Math.ceil(result);
          let showResult =
            roundedResult <= couponInfo[0].maximumDiscount
              ? roundedResult
              : couponInfo[0].maximumDiscount;

          let discountPrice =
            couponInfo[0].shippingCharge == "Include" ? shippingCharge : 0;

          let amountTotal = (amount - showResult) + discountPrice;

          let infoObject = {
            shippingCharge:
              couponInfo[0].shippingCharge == "Include"
                ? `${shippingCharge}`
                : "Free",
            totalAmount: amount + shippingCharge,
            discountAmount: `${showResult}`,
            amount: amountTotal,
            couponExpired: false,
          };

          return res.send({
            success: {
              message: "Data Fetch Successfull.",
              data: infoObject,
            },
          });
        }
      } else {
        return res.send({
          error: {
            message: "There was an error.",
            data: {
              shippingCharge: shippingCharge,
              totalAmount: amount + shippingCharge,
              discountAmount: "0",
              amount: amount + shippingCharge,
              couponExpired: false,
            },
          },
        });
      }
    } else {
      return res.send({
        error: {
          message: "There was an error.",
          data: {
            shippingCharge: shippingCharge,
            totalAmount: amount + shippingCharge,
            discountAmount: "0",
            amount: amount + shippingCharge,
            couponExpired: true,
          },
        },
      });
    }
  } else {
    return res.send({
      error: {
        message: "Failed to fetch Data",
        data: "Invalid Coupon",
      },
    });
  }
};

const handleDestroyCoupon = async (req, res) => {
  const { id } = req.body;

  try {
    await couponModel.findByIdAndDelete({ _id: id });
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
  handleAllCoupon,
  handleStoreCoupon,
  handleCheckCoupon,
  handleDestroyCoupon,
};



