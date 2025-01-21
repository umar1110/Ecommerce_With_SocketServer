const { orderStatus } = require("../constants/orderConstants");
const { userRoles } = require("../constants/userConstants");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// Create Order
exports.createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    shippingPrice,
    totalPrice,
    extraNote,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    shippingPrice,
    totalPrice,
    extraNote,
    user: req.user?._id || null,
  });

  if (!order) {
    throw new ApiError(400, `Order creation failed`);
  }

  return ApiResponse.success(res, {
    data: order,
    message: "Order submittted successfully",
  });
});

//  Get signle Order
exports.getSingleOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, `Order not found . `);
  }
  if (
    req.user?.role !== userRoles.ADMIN &&
    (order?.user === null ||
      order?.user.toString() !== req.user?._id.toString())
  ) {
    throw new ApiError(403, `You are not authorized to view this order`);
  }

  return ApiResponse.success(res, {
    data: order,
  });
});

// Get my orders
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  return ApiResponse.success(res, {
    data: orders,
  });
});

// Improvement neede
// Get all orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const searchOrderId = req.query.searchOrderId || null;

  if (searchOrderId) {
    const order = await Order.findById(searchOrderId);
    if (!order) {
      throw new ApiError(404, `Order not found with id of ${searchOrderId} `);
    }
    return ApiResponse.success(res, {
      data: {
        orders: [order],
        pagination: {
          total: 1,
          page: 1,
          pages: 1,
          limit: 1,
        },
      },
    });
  }

  // Filter on status if provided
  if (req.query?.status && req.query.status != "all") {
    const orders = await Order.find({ orderStatus: req.query.status })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalOrders = await Order.countDocuments({
      orderStatus: req.query.status,
    });

    return ApiResponse.success(res, {
      data: {
        orders,
        pagination: {
          total: totalOrders,
          page,
          pages: Math.ceil(totalOrders / limit),
          limit,
        },
      },
    });
  }

  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const totalOrders = await Order.countDocuments();

  return ApiResponse.success(res, {
    data: {
      orders,
      pagination: {
        total: totalOrders,
        page,
        pages: Math.ceil(totalOrders / limit),
        limit,
      },
    },
  });
});

// Update Order Status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, `Order not found. `);
  }

  if (
    (order.orderStatus === orderStatus.DELIVERED ||
      order.orderStatus === orderStatus.CANCELLED) &&
    req.body.status !== orderStatus.RETURNED
  ) {
    throw new ApiError(404, `Order is already delivered. `);
  }

  if (req.body.status === orderStatus.DELIVERED) {
    order.deliveredAt = Date.now();
    // Add purchase history to user
    const user = await User.findById(order.user);
    if (!user) {
      throw new ApiError(404, `User not found who ordered. `);
    }
    // Push every item product to user purchase history , if already there than skip
    order.orderItems.forEach((item) => {
      if (
        !user.purchaseHistory.find(
          (p) => p.product.toString() === item.product.toString()
        )
      ) {
        user.purchaseHistory.push({
          product: item.product,
          isReviewed: false,
        });
      }
    });
  }

  if (req.body.status === orderStatus.SHIPPED) {
    // Send email to user
    //    Updating Products stock and features stocks
    for (let i = 0; i < order.orderItems.length; i++) {
      const item = order.orderItems[i];

      const product = await Product.findById(item.product);

      product.sold = product.sold + item.quantity;
      product.stock = product.stock - item.quantity;
      // product.features.forEach(async (feature) => {
      //   if (item.selectedFeatures.find((f) => f.feature === feature.feature)) {
      //     feature.values;
      //   }
      // });

      // Update stock for each selected feature
      item.selectedFeatures.forEach((selectedFeature) => {
        const productFeature = product.features.find(
          (f) => f.feature === selectedFeature.feature
        );

        if (productFeature) {
          const valueToUpdate = productFeature.values.find(
            (v) => v.value === selectedFeature.value
          );

          if (valueToUpdate) {
            // Reduce the stock based on the order quantity
            valueToUpdate.stock -= item.quantity;

            if (valueToUpdate.stock < 0) {
              throw new ApiError(
                400,
                `Sorry, ${product.name} with ${selectedFeature.feature} ${selectedFeature.value} is out of stock`
              );
            }
          }
        }
      });

      await product.save({ validateBeforeSave: false });
    }
  }

  if (req.body.status === orderStatus.RETURNED) {
    // Send email to user
    //    Updating Products stock and features stocks
    for (let i = 0; i < order.orderItems.length; i++) {
      const item = order.orderItems[i];

      const product = await Product.findById(item.product);

      product.sold = product.sold - item.quantity;
      product.stock = product.stock + item.quantity;
      // product.features.forEach(async (feature) => {
      //   if (item.selectedFeatures.find((f) => f.feature === feature.feature)) {
      //     feature.values;
      //   }
      // });

      // Update stock for each selected feature
      item.selectedFeatures.forEach((selectedFeature) => {
        const productFeature = product.features.find(
          (f) => f.feature === selectedFeature.feature
        );

        if (productFeature) {
          const valueToUpdate = productFeature.values.find(
            (v) => v.value === selectedFeature.value
          );

          if (valueToUpdate) {
            // Reduce the stock based on the order quantity
            valueToUpdate.stock += item.quantity;

            if (valueToUpdate.stock < 0) {
              throw new ApiError(
                400,
                `Sorry, ${product.name} with ${selectedFeature.feature} ${selectedFeature.value} is out of stock`
              );
            }
          }
        }
      });

      await product.save({ validateBeforeSave: false });
    }
  }

  order.orderStatus = req.body.status;

  await order.save({ validateBeforeSave: false });

  return ApiResponse.success(res, {
    data: order,
    message: "Order status updated successfully",
  });
});

//  Delete Order
exports.deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    throw new ApiError(404, `Order not found with id of ${req.params.id} `);
  }

  return ApiResponse.success(res, {
    message: "Order deleted successfully",
  });
});

//  Remaining features
// 1. Add return of orders
// 2. Email notification to user for confirmation etc .
