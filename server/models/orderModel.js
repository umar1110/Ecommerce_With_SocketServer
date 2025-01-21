const mongoose = require("mongoose");
const { orderStatus } = require("../constants/orderConstants");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        selectedFeatures: [
          {
            feature: {
              type: String,
            },
            value: {
              type: String,
            },
          },
        ],
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },

      name: {
        type: String,
        required: true,
      },
      phoneNo: {
        type: String,
        required: true,
      },
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    extraNote: {
      type: String,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    orderStatus: {
      type: Number,
      required: true,
      enum: Object.values(orderStatus),
      default: orderStatus.PROCESSING,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
