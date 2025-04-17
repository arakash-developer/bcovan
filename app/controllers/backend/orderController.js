const orderModel = require("../../models/order");

const handleAllOrder = async (req, res) => {
  const orderAll = await orderModel
    .find({})
    .populate({ path: "userId", select: "_id uname" })
    .sort({ createdAt: -1 });

  if (orderAll.length > 0) {
    return res.send({
      success: {
        message: "Data Fetch Successfull.",
        data: orderAll,
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

const handleStoreOrder = async (req, res) => {
  const {
    uname,
    phone,
    city,
    area,
    address,
    email,
    orderNotes,
    shippingCharge,
    shippingMethod,
    productInfo,
    paymentGateway,
    totalAmount,
    discountAmount,
    amount,
    userId,
  } = req.body;

  const order = new orderModel({
    uname,
    phone,
    city,
    area,
    address,
    email,
    orderNotes,
    shippingCharge,
    shippingMethod,
    productInfo,
    paymentGateway,
    totalAmount,
    discountAmount,
    amount,
    userId,
  });

  let orderData = await order.save();

  if (orderData._id !== "") {
    return res.send({
      success: {
        message: "Order Add Successfull.",
        data: orderData,
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

const handleUpdateOrder = async (req, res) => {
  const { id, orderStatus } = req.body;
  try {
    await orderModel.findByIdAndUpdate(
      { _id: id },
      { orderStatus: orderStatus },
      { new: true }
    );

    return res.send({
      success: {
        message: "Order Accept Successfully!",
      },
    });
  } catch (err) {
    return res.send({
      error: {
        message: "Failed to Update. Please try again.",
      },
    });
  }
};

const handleDestroyOrder = async (req, res) => {
  const { id } = req.body;

  try {
    await orderModel.findByIdAndDelete({ _id: id });
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
  handleAllOrder,
  handleStoreOrder,
  handleUpdateOrder,
  handleDestroyOrder,
};
