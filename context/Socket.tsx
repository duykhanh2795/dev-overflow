// "use client";
// import {
//   getUserNotifications,
//   markAllNotificationAsRead,
//   markNotificationAsRead,
// } from "@/lib/actions/notification.action";
// import { useSession } from "next-auth/react";
// import { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";
// interface SocketContextType {
//   socket: Socket | null;
//   notifications: AnswerNotification[];
//   markAllAsRead: () => Promise<void>;
//   markAsRead: (notificationId: string) => Promise<void>;
// }

// const SocketContext = createContext<SocketContextType | undefined>(undefined);

// export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [notifications, setNotifications] = useState<AnswerNotification[]>([]);
//   const session = useSession();

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (session.status === "authenticated" && session?.data?.user?.id) {
//         const result = await getUserNotifications({
//           userId: session?.data?.user.id,
//         });
//         console.log("Fetched notifications:", result.data?.notifications);
//         setNotifications(result.data?.notifications || []);
//       }
//     };
//     fetchNotifications();
//   }, [session.status, session?.data?.user?.id]);
//   useEffect(() => {
//     const socketInstance = io("http://localhost:4000");

//     setSocket(socketInstance);

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);
//   useEffect(() => {
//     if (
//       socket &&
//       session.status === "authenticated" &&
//       session.data?.user?.name
//     ) {
//       socket.emit("newUser", session.data.user.name);

//       const handleNotification = (data: userNotification) => {
//         console.log("🔔 New notification received:", data);
//         setNotifications((prev) => [...prev, data]);
//       };

//       socket.on("getNotification", handleNotification);

//       return () => {
//         socket.off("getNotification", handleNotification);
//       };
//     }
//   }, [socket, session.status, session.data?.user?.name]);

//   const markAllAsRead = async () => {
//     if (!session.data?.user?.id) return;
//     setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
//     await markAllNotificationAsRead({ userId: session.data.user.id });
//   };
//   const markAsRead = async (notificationId: string) => {
//     if (!session.data?.user?.id) return;
//     setNotifications((prev) =>
//       prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
//     );
//     await markNotificationAsRead({ notificationId });
//   };
//   return (
//     <SocketContext.Provider
//       value={{ socket, notifications, markAllAsRead, markAsRead }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };
// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context)
//     throw new Error("useSocket must be used within a SocketProvider");
//   return context;
// };
// "use client";
// import {
//   getUserNotifications,
//   markAllNotificationAsRead,
//   markNotificationAsRead,
// } from "@/lib/actions/notification.action";
// import { useSession } from "next-auth/react";
// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { io, Socket } from "socket.io-client";

// interface SocketContextType {
//   socket: Socket | null;
//   notifications: AnswerNotification[];
//   markAllAsRead: () => Promise<void>;
//   markAsRead: (notificationId: string) => Promise<void>;
// }

// const SocketContext = createContext<SocketContextType | undefined>(undefined);

// export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
//   const { data: session, status } = useSession();
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [notifications, setNotifications] = useState<AnswerNotification[]>([]);

//   useEffect(() => {
//     const socketInstance = io(
//       process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"
//     );
//     setSocket(socketInstance);
//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (status !== "authenticated" || !session?.user?.id) return;

//     getUserNotifications({ userId: session.user.id }).then((result) => {
//       setNotifications(result.data?.notifications || []);
//     });
//     if (!socket) return;

//     socket.emit("newUser", session.user.name);
//     const handleNotification = (data: userNotification) => {
//       console.log("🔔 New notification received:", data);
//       setNotifications((prev) => [...prev, data]);
//     };

//     socket.on("getNotification", handleNotification);

//     return () => {
//       socket.off("getNotification", handleNotification);
//     };
//   }, [socket, status, session?.user?.id]);

//   const markAllAsRead = useCallback(async () => {
//     if (!session?.user?.id) return;
//     setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
//     await markAllNotificationAsRead({ userId: session.user.id });
//   }, [session?.user?.id]);

//   const markAsRead = useCallback(
//     async (notificationId: string) => {
//       if (!session?.user?.id) return;
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
//       );
//       await markNotificationAsRead({ notificationId });
//     },
//     [session?.user?.id]
//   );

//   const value = useMemo(
//     () => ({ socket, notifications, markAllAsRead, markAsRead }),
//     [socket, notifications, markAllAsRead, markAsRead]
//   );

//   return (
//     <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
//   );
// };

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context)
//     throw new Error("useSocket must be used within a SocketProvider");
//   return context;
// };
"use client";
import {
  getUserNotifications,
  markAllNotificationAsRead,
  markNotificationAsRead,
} from "@/lib/actions/notification.action";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  notifications: AnswerNotification[];
  markAllAsRead: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  console.log("SocketProvider session:", session);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<AnswerNotification[]>([]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"
    );
    setSocket(socketInstance);
    console.log("session id:", session.user.id);
    getUserNotifications({ userId: session.user.id }).then((result) => {
      console.log("Fetched notifications:", result.data?.notifications);
      setNotifications(result.data?.notifications || []);
    });

    socketInstance.emit("newUser", session.user.name);

    const handleNotification = (data: userNotification) => {
      console.log("🔔 New notification received:", data);
      setNotifications((prev) => [data, ...prev]);
    };
    socketInstance.on("getNotification", handleNotification);

    return () => {
      socketInstance.off("getNotification", handleNotification);
      socketInstance.disconnect();
    };
  }, [status, session?.user?.id]);

  const markAllAsRead = async () => {
    if (!session?.user?.id) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllNotificationAsRead({ userId: session.user.id });
  };

  const markAsRead = async (notificationId: string) => {
    if (!session?.user?.id) return;
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
    );
    await markNotificationAsRead({ notificationId });
  };

  return (
    <SocketContext.Provider
      value={{ socket, notifications, markAllAsRead, markAsRead }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocket must be used within a SocketProvider");
  return context;
};
