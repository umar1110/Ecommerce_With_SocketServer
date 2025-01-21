import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./slices/authSlice";
import productReducer from "./slices/productsSlice";
import cartreducer from "./slices/cartSlice";
import categoriesReducer from "./slices/categoriesSlice";
import checkOutReducer from "./slices/checkOutSlice";
const store = configureStore({
  reducer: {
    auth: authreducer,
    cart: cartreducer,
    products: productReducer,
    categories: categoriesReducer,
    checkOut: checkOutReducer,
  },
});

export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // Defaults to localStorage
// import { combineReducers } from "redux";
// import { thunk } from "redux-thunk";

// import authreducer from "./slices/authSlice";
// import productReducer from "./slices/productsSlice";
// import cartreducer from "./slices/cartSlice";
// import categoriesReducer from "./slices/categoriesSlice";
// // const store = configureStore({
// //   reducer: {
// //     auth: authreducer,
// //     cart: cartreducer,
// //     products: productReducer,
// //     categories: categoriesReducer,
// //   },
// // });

// // Define persist configuration
// const persistConfig = {
//   key: "root",
//   storage,
//   // whitelist: ["some"], // Only persist 'some' slice
//   // blacklist: ["other"], // Do not persist 'other' slice
// };

// // Combine your reducers
// const rootReducer = combineReducers({
//   auth: authreducer,
//   cart: cartreducer,
//   products: productReducer,
//   categories: categoriesReducer,
// });

// // Create a persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Configure the store with persistedReducer
// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// // Persistor
// export const persistor = persistStore(store);

// export default store;
