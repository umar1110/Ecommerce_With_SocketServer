import { createContext, useMemo, useContext, useEffect } from "react";
import io from "socket.io-client";
import { server } from "./constants/config";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => {
    const socketInstance = io(server, { withCredentials: true });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return socketInstance;
  }, []);

  //   useEffect(() => {
  //     return () => {
  //       socket.disconnect();
  //     };
  //   }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, getSocket };
