// import next from "next";
// import { createServer } from "node:http";
// import { Server } from "socket.io";

// const dev = process.env.NODE_ENV !== "production";
// const hostname = "localhost";
// const port = 3000;

// const app = next({ dev, hostname, port });
// const handler = app.getRequestHandler();

// const onlineUsers = new Map<string, string[]>();

// const addNewUser = (username: string, socketId: string) => {
//   const existing = onlineUsers.get(username) || [];
//   onlineUsers.set(username, [...existing, socketId]);
// };

// const removeUser = (socketId: string) => {
//   for (const [username, sockets] of onlineUsers.entries()) {
//     const filtered = sockets.filter((id) => id !== socketId);
//     if (filtered.length > 0) {
//       onlineUsers.set(username, filtered);
//     } else {
//       onlineUsers.delete(username);
//     }
//   }
// };

// const getUserSockets = (username: string) => onlineUsers.get(username) || [];

// app.prepare().then(() => {
//   const httpServer = createServer(handler);

//   const io = new Server(httpServer, {
//     cors: {
//       origin: "http://localhost:3000",
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("✅ New connection:", socket.id);

//     socket.on("newUser", (username: string) => {
//       addNewUser(username, socket.id);
//       console.log("🟢", username, "connected");
//       console.log("👥 Online users:", Array.from(onlineUsers.keys()));
//     });

//     socket.on("sendNotification", (un: any) => {
//       const receivers = getUserSockets(un.receiver.name);

//       if (receivers.length > 0) {
//         receivers.forEach((id: string) =>
//           io.to(id).emit("getNotification", un)
//         );
//         console.log(`📨 ${un.sender.name} → ${un.receiver.name}`);
//       } else {
//         console.log(`⚠️ ${un.receiver.name} is offline`);
//       }
//     });

//     socket.on("disconnect", () => {
//       removeUser(socket.id);
//       console.log("🔴 Disconnected:", socket.id);
//     });
//   });

//   httpServer
//     .once("error", (err) => {
//       console.error(err);
//       process.exit(1);
//     })
//     .listen(port, () => {
//       console.log(`> Ready on http://${hostname}:${port}`);
//     });
// });
// index.ts
import { Server } from "socket.io";

const io = new Server({
  cors: { origin: "http://localhost:3000" },
});

const onlineUsers = new Map();

const addNewUser = (username: string, socketId: string) => {
  if (onlineUsers.has(username)) {
    onlineUsers.get(username).push(socketId);
  } else {
    onlineUsers.set(username, [socketId]);
  }
};

const removeUser = (socketId: string) => {
  for (const [username, sockets] of onlineUsers.entries()) {
    const filtered = sockets.filter((id: string) => id !== socketId);
    if (filtered.length > 0) {
      onlineUsers.set(username, filtered);
    } else {
      onlineUsers.delete(username);
    }
  }
};

const getUserSockets = (username: string) => onlineUsers.get(username) || [];

io.on("connection", (socket) => {
  console.log("✅ New connection:", socket.id);

  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
    console.log("🟢", username, "connected");
    console.log("👥 Online users:", Array.from(onlineUsers.keys()));
  });

  socket.on("sendNotification", (un: userNotification) => {
    const receivers = getUserSockets(un.receiver.name);
    if (receivers.length > 0) {
      receivers.forEach((id: string) => io.to(id).emit("getNotification", un));
      console.log(`📨 ${un.sender.name} → ${un.receiver.name}`);
    } else {
      console.log(`⚠️ ${un.receiver} is offline`);
    }
  });
  // socket.on("sendNotification", ({ sender, receiver, type, message }) => {
  //   const receivers = getUserSockets(receiver);
  //   if (receivers.length > 0) {
  //     receivers.forEach((id: string) =>
  //       io.to(id).emit("getNotification", { sender, receiver, type, message })
  //     );
  //     console.log(`📨 ${sender} → ${receiver}`);
  //   } else {
  //     console.log(`⚠️ ${receiver} is offline`);
  //   }
  // });
  // socket.on("sendText", ({ senderName, receiverName, text }) => {
  //   const receivers = getUserSockets(receiverName);
  //   if (receivers.length > 0) {
  //     receivers.forEach((id: string) =>
  //       io.to(id).emit("getText", { senderName, text })
  //     );
  //   }
  // });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("🔴 Disconnected:", socket.id);
  });
});

(io as any).listen(4000, () =>
  console.log("🚀 Socket.IO server running on port 4000")
);
