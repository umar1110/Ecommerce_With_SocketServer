import { createSlice } from "@reduxjs/toolkit";

export const checkOutSlice = createSlice({
  name: "checkOut",
  initialState: {
    products: [],
  },
  reducers: {
    getCheckout: (state) => {
      const checkout = localStorage.getItem("checkout");
      state.products = checkout ? JSON.parse(checkout) : [];
    },
    setCheckout: (state, action) => {
      state.products = action.payload.products;
      //    also set to local host for future use
      localStorage.setItem("checkout", JSON.stringify(action.payload.products));
    },
    addProductInCheckOut: (state, action) => {
      state.products = [action.payload.product, ...state.products];
      //    also set to local host for future use
      localStorage.setItem("checkout", JSON.stringify(state.products));
    },
    cleareCheckout: (state) => {
      state.products = [];
      //    also set to local host for future use
      localStorage.setItem("checkout", JSON.stringify(state.products));
    },
    deleteProductFromCheckout: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      );
      //    also set to local host for future use
      localStorage.setItem("checkout", JSON.stringify(state.products));
    },
  },
});

export const {
  setCheckout,
  addProductInCheckOut,
  cleareCheckout,
  getCheckout,
  deleteProductFromCheckout,
} = checkOutSlice.actions;
export default checkOutSlice.reducer;
