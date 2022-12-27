const Chat = require("../models/chat");
const Chatroom = require("../models/chatroom");
var room;
module.exports.chatSockets = function (socketServer) {
  let io = require("socket.io")(socketServer);

  io.sockets.on("connection", function (socket) {
    socket.on("disconnect", function () {});

    socket.on("join_room", async function (data) {
      room = await Chatroom.findById(data.chatroom);
      socket.join(data.chatroom);
      io.in(data.chatroom).emit("user_joined", data);
    });
    socket.on("send_message", async function (data) {
      let newMessage = await Chat.create({
        user: data.user_id,
        message: data.message,
      });
      if (room) {
        room.messages.push(newMessage);
        room.save();
      }
      io.in(data.chatroom).emit("receive_message", data);
    });
  });
};
