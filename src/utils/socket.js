const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const { timeStamp } = require("console");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex");
}

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: ["http://localhost:5173", "https://devbharat-web.onrender.com", "https://klchat.onrender.com"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", async ({firstName, userId, targetUserId}) => {
        const roomId = getSecretRoomId(userId, targetUserId);

        // console.log(firstName + " joining room: " + roomId);
        socket.join(roomId);

        await Chat.updateMany({
          participants: { $all: [userId, targetUserId] },
          "messages.status": "delivered"
        }, {
          $set: { "messages.$[elem].status": "seen" }
        }, {
          arrayFilters: [{ "elem.status": "delivered", "elem.senderId": targetUserId }]
        }).catch(err => console.log(err));

        io.to(roomId).emit("messagesSeen", { userId, targetUserId });
    });
    socket.on("sendMessage", async ({firstName,lastName, userId, targetUserId, text}) => {
      
      try {
          const roomId = getSecretRoomId(userId, targetUserId);
          // console.log(firstName + "  " + text);

          let chat = await Chat.findOne({
            participants: {$all: [userId, targetUserId]}
          });

          if(!chat){
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
              });
          }

          chat.messages.push({
            senderId: userId,
            text: text,
            status: "delivered",
          })
          
          await chat.save();
          io.to(roomId).emit("messageReceived", {firstName,lastName, text, status:"delivered"});

          const clients = await io.in(roomId).allSockets();
          if (clients.size > 1) {
            await Chat.updateMany({
              participants: { $all: [userId, targetUserId] },
              "messages.status": { $in: ["delivered"] }
            }, {
              $set: { "messages.$[elem].status": "seen" }
            }, {
              arrayFilters: [{ "elem.status": { $in: ["delivered"] }, "elem.senderId": targetUserId }]
            }).catch(err => console.log(err));

            io.to(roomId).emit("messagesSeen", { userId, targetUserId });
          }
        } catch (error) {
          console.log(error);
        }

    });

    socket.on("messageSeen", async ({ userId, targetUserId }) => {
      try {
        const roomId = getSecretRoomId(userId, targetUserId);

        await Chat.updateMany({
          participants: { $all: [userId, targetUserId] },
          "messages.status": "delivered"
        }, {
          $set: { "messages.$[elem].status": "seen" }
        }, {
          arrayFilters: [{ "elem.status": "delivered", "elem.senderId": targetUserId }]
        });

        io.to(roomId).emit("messagesSeen", { userId, targetUserId });
      } catch (error) {
        console.log(error);
      }
    });


//     socket.on("checkRoom", (roomId, callback) => {
//       const room = io.sockets.adapter.rooms.get(roomId);
//       const isActive = room && room.size > 0;
//       callback(isActive);
//   });


    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;