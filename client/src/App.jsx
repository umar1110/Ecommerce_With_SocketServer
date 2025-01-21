import "./App.css";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/layout/Footer";
import NavBar from "./components/layout/NavBar";
import { ThemeProvider } from "./components/theme-provider";
import Categories from "./pages/Admin/Categories";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import DashboardHome from "./pages/Admin/Dashboard/DashboardHome";
import AdminOrders from "./pages/Admin/orders/AdminOrders";
import OrderDetails from "./pages/Admin/orders/OrderDetails";
import AddProduct from "./pages/Admin/products/AddProduct";
import AllProducts from "./pages/Admin/products/AllProducts";
import EditProduct from "./pages/Admin/products/EditProduct";
import ProductMain from "./pages/Admin/products/ProductMain";
import CheckOutpage from "./pages/CheckOutpage";
import HomePage from "./pages/HomePage";
import LoginScreen from "./pages/LoginScreen.jsx";
import MyOrderDetails from "./pages/order/MyOrderDetails";
import MyOrders from "./pages/order/MyOrders";
import CategorProducts from "./pages/product/CategorProducts";
import MainCategoryProducts from "./pages/product/MainCategoryProducts";
import ProductDetail from "./pages/product/ProductDetail";
import SearchedProducts from "./pages/product/SearchedProducts";
import SubCategoryProducts from "./pages/product/SubCategoryProducts";
import SignupScreen from "./pages/SignupScreen";
import { fetchMe } from "./redux/slices/authSlice";
import { getCart } from "./redux/slices/cartSlice";
import {
  fetchAllCategories,
  fetchCategories,
  fetchMainCategories,
  fetchSubCategories,
} from "./redux/slices/categoriesSlice";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import { getSocket } from "./socket";

function App() {
  const dispatch = useDispatch();

  const socket = getSocket();

  useEffect(() => {
    dispatch(getCart());
    dispatch(fetchMe());
    dispatch(fetchMainCategories());
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
    dispatch(fetchAllCategories());
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
    });

    socket.on("message", (message) => {
      console.log(message);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <>
      <div className="flex flex-col min-h-screen  overflow-hidden">
        <ThemeProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckOutpage />
                  </ProtectedRoute>
                }
              />
              {/* Products */}
              {/* /product/:id => for product details */}
              {/* /products/:maincategory => for products of maincategory  */}
              {/* /products/:maincategory/:category => for products of category  */}
              {/* /products/:maincategory/:category/:subcategory => for products of subcategory   */}

              <Route
                path="/products/:mainCategory"
                element={<MainCategoryProducts />}
              />
              <Route
                path="/products/:mainCategory/:category"
                element={<CategorProducts />}
              />
              <Route
                path="/products/:mainCategory/:category/:subCategory"
                element={<SubCategoryProducts />}
              />

              {/* Search Products  */}
              <Route path="/search" element={<SearchedProducts />} />

              {/* Product Details */}
              <Route path="/product/:productName" element={<ProductDetail />} />

              {/* Order routes */}
              <Route
                path="/myorders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/myorder/:id"
                element={
                  <ProtectedRoute>
                    <MyOrderDetails />
                  </ProtectedRoute>
                }
              />

              {/* Admin Dashboard  */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              >
                <Route path="" element={<DashboardHome />} />

                {/* Products */}
                <Route path="products" element={<ProductMain />}>
                  <Route path="" element={<AllProducts />} />
                  <Route path="add" element={<AddProduct />} />
                  <Route path="edit/:id" element={<EditProduct />} />
                </Route>
                {/* Categories */}
                <Route path="categories" element={<Categories />} />
                {/* Admin Orders  */}
                <Route path="orders" element={<AdminOrders />} />
                {/* Admin order details */}
                <Route path="order/:id" element={<OrderDetails />} />
                {/* Admin Users  */}
              </Route>

              {/* <Route
                path="*"
                element={<div className="mt-28">404 Not Found</div>}
              /> */}
            </Routes>
            <Footer />
          </BrowserRouter>
          <ToastContainer />
        </ThemeProvider>
      </div>
    </>
  );
}

export default App;
