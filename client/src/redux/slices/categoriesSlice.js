import axiosBackend from "@/utils/axiosInstanceBackend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchMainCategories = createAsyncThunk(
  "categories/fetchMainCategories",
  async () => {
    try {
      const response = await axiosBackend.get("/api/v1/category/maincategory");
      return response.data.data;
    } catch (error) {
      throw Error(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    try {
      const response = await axiosBackend.get("/api/v1/category/allcategories");
      return response.data.data;
    } catch (error) {
      throw Error(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSubCategories = createAsyncThunk(
  "categories/fetchSubCategories",
  async () => {
    try {
      const response = await axiosBackend.get(
        "/api/v1/category/allsubcategories"
      );
      return response.data.data;
    } catch (error) {
      throw Error(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  "categories/fetchAllCategories",
  async () => {
    try {
      const response = await axiosBackend.get("/api/v1/category");
      return response.data.data;
    } catch (error) {
      throw Error(error.response?.data?.message || error.message);
    }
  }
);
export const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    allCategories: [],
    allCategoriesLoading: true,
    mainCategories: [],
    categories: [],
    subCategories: [],
    mainCategoriesLoading: true,
    categoriesLoading: true,
    subCategoriesLoading: true,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMainCategories.pending, (state) => {
      state.mainCategoriesLoading = true;
    });
    builder.addCase(fetchMainCategories.fulfilled, (state, action) => {
      state.mainCategoriesLoading = false;
      state.mainCategories = action.payload;
    });
    builder.addCase(fetchMainCategories.rejected, (state, action) => {
      state.mainCategoriesLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(fetchCategories.pending, (state) => {
      state.categoriesLoading = true;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categoriesLoading = false;
      state.categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.categoriesLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(fetchSubCategories.pending, (state) => {
      state.subCategoriesLoading = true;
    });
    builder.addCase(fetchSubCategories.fulfilled, (state, action) => {
      state.subCategoriesLoading = false;
      state.subCategories = action.payload;
    });
    builder.addCase(fetchSubCategories.rejected, (state, action) => {
      state.subCategoriesLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchAllCategories.pending, (state) => {
      state.allCategoriesLoading = true;
    });
    builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
      state.allCategoriesLoading = false;
      state.allCategories = action.payload;
    });
    builder.addCase(fetchAllCategories.rejected, (state, action) => {
      state.allCategoriesLoading = false;
      state.error = action.error.message;
    });
  },
});

export const { clearErrors } = categoriesSlice.actions;
export default categoriesSlice.reducer;
