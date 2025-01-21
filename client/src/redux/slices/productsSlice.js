import axiosBackend from "@/utils/axiosInstanceBackend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ title = "", page = 1, limit = 10 }) => {
    try {
      const response = await axiosBackend.get(
        `/api/v1/product?page=${page}&limit=${limit}&title=${
          title ? title : ""
        }`
      );
      return response.data.data;
    } catch (error) {
      throw Error(error.response?.data?.message || error.message);
    }
  }
);

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    titleSearch: "",
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setTitleSearch: (state, action) => {
      state.titleSearch = action.payload;
    },
    clearTitleSearch: (state) => {
      state.titleSearch = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
      state.success = true;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.success = false;
    });
  },
});

export const { clearErrors, clearSuccess, setTitleSearch, clearTitleSearch } =
  productsSlice.actions;
export default productsSlice.reducer;
