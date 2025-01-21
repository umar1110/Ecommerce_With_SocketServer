import axiosBackend from "@/utils/axiosInstanceBackend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const LoginUser = createAsyncThunk(
  "login",
  async ({ email, password }) => {
    try {
      toast.loading("Logging in...");
      const response = await axiosBackend.post(
        "/api/v1/users/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(response.data.data);
      toast.dismiss();
      toast.success("Login successful");
      return response.data.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.dismiss();
        toast.error(error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        toast.dismiss();
        toast.error("Login failed");
        throw new Error(`Login failed: , ${error.message}`);
      }
    }
  }
);

export const SignupUser = createAsyncThunk(
  "signup",
  async ({ email, password, firstName, lastName }) => {
    try {
      toast.loading("Signing up...");
      const response = await axiosBackend.post(
        "/api/v1/users/register",
        {
          email,
          name: `${firstName} ${lastName}`,
          password,
        },
        { withCredentials: true }
      );
      console.log(response.data.data);
      toast.dismiss();
      toast.success("Signup successful");
      return response.data.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.dismiss();
        toast.error(error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        toast.dismiss();
        toast.error("Signup failed " + error.message);
        throw new Error(`Signup failed: , ${error.message}`);
      }
    }
  }
);

export const fetchMe = createAsyncThunk("fetchUser", async () => {
  try {
    const response = await axiosBackend.get("/api/v1/users/me", {
      withCredentials: true,
    });
    return response.data.user;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
});

export const logoutUser = createAsyncThunk("logout", async () => {
  try {
    toast.loading("Logging out...");
    await axiosBackend.get("/api/v1/users/logout", { withCredentials: true });
    toast.dismiss();
    toast.success("Logout successful");
    return true;
  } catch (error) {
    toast.dismiss();
    toast.error("Logout failed");
    throw new Error(error.response?.data?.message || error.message);
  }
});

// Slice for authentication
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: true,
    user: null,

    isAuthenticated: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(SignupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(SignupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(SignupUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

// export const {  } = authSlice.actions;
export default authSlice.reducer;
