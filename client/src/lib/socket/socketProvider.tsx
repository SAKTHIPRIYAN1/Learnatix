"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "@/lib/socket/socket";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const s = getSocket();

    setSocket(s);

    s.on("connect", () => {
      console.log("Connected to socket");
      setIsConnected(true);
    });

    s.on("disconnect", () => {
      console.log("Disconnected from socket");
      setIsConnected(false);
    });

    // for notifications!!!!
    s.on("notification", (data) => {
      console.log("Notification:", data);
    });

   

    return () => {
      s.off("connect");
      s.off("disconnect");
      s.off("notification");
      s.off("chat-message");
      s.off("newMessage");
      s.off("joinClass")
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
