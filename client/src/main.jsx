import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store";
import { SocketProvider } from "./socket.jsx";
// import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <Provider store={store} defaultTheme="light" storageKey="vite-ui-theme">
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <App />
      {/* </PersistGate> */}
    </Provider>
  </SocketProvider>
);
