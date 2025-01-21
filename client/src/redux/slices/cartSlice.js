import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    // Get categories from localStorage
    getCart: (state) => {
      const cart = localStorage.getItem("cart");
      state.cart = cart ? JSON.parse(cart) : [];
    },
    addToCart: (state, action) => {
      // Also add cart to local storage
      //    Already product exist than no need to add
      toast.loading();
      if (
        state.cart.find((item) => item._id === action.payload?.product?._id)
      ) {
        toast.dismiss();
        toast.info("Product already in cart", {
          position: "bottom-right",
          autoClose: 2000,
        });
        return;
      }

      localStorage.setItem(
        "cart",
        JSON.stringify([
          ...state.cart,
          {
            ...action.payload.product,
            quantity: action.payload.quantity || 1,
            selectedFeatures:
              action.payload.selectedFeatures ||
              action.payload.product?.features?.map((feature) => {
                const value = feature.values.find((value) => value.stock > 0);
                if (!value) {
                  return;
                }
                return {
                  feature: feature.feature,
                  value: value ? value.value : "No stock",
                  stock: value.stock || 0,
                };
              }),
          },
        ])
      );
      state.cart = [
        ...state.cart,
        {
          ...action.payload.product,
          quantity: action.payload.quantity || 1,
          selectedFeatures:
            action.payload.selectedFeatures ||
            action.payload.product?.features?.map((feature) => {
              const value = feature.values.find((value) => value.stock > 0);
              if (!value) {
                return;
              }
              return {
                feature: feature.feature,
                value: value ? value.value : "No stock",
                stock: value.stock || 0,
              };
            }),
        },
      ];
      toast.dismiss();
      toast.success("Product added to cart", {
        position: "bottom-right",
        autoClose: 2000,
      });
    },
    removeFromCart: (state, action) => {
      // Also remove cart from local storage
      localStorage.setItem(
        "cart",
        JSON.stringify(state.cart.filter((item) => item._id !== action.payload))
      );
      state.cart = state.cart.filter((item) => item._id !== action.payload);
    },
    // increment quantity of product
    incrementQuantity: (state, action) => {
      const index = state.cart.findIndex((item) => item._id === action.payload);
      const minStock = state.cart[index].selectedFeatures.reduce(
        (acc, curr) => {
          return Math.min(acc, curr.stock);
        },
        Infinity
      );

      if (
        state.cart[index].quantity + 1 > state.cart[index].stock ||
        state.cart[index].quantity + 1 > minStock
      ) {
        toast.error("No more stock available", {
          position: "bottom-right",
          autoClose: 2000,
        });
        return;
      }
      state.cart[index].quantity += 1;
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    // decrement quantity of product
    decrementQuantity: (state, action) => {
      const index = state.cart.findIndex((item) => item._id === action.payload);
      if (state.cart[index].quantity > 1) {
        state.cart[index].quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
    // Clear Cart
    clearCart: (state) => {
      localStorage.removeItem("cart");
      state.cart = [];
    },
  },
});

export const {
  getCart,
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
