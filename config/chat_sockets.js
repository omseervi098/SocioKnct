const Chat = require("../models/chat");
const Chatroom = require("../models/chatroom");
const Poll = require("../models/poll");
const Vote = require("../models/vote");
const User = require("../models/user");
var room;
module.exports.chatSockets = function (socketServer) {
  let io = require("socket.io")(socketServer);

  io.sockets.on("connection", function (socket) {
    console.log("new connection received", socket.id);
    socket.on("disconnect", function () {});
    // listen to vote and emit it to all users
    socket.on("vote", async function (data) {
      console.log(data);
      io.emit("vote", data);
    });

    // listen if new_post is emitted and add user then emit it to all users
    //emit to all user with id
    socket.on("new_post", async function (data) {
      // emit to all users except sender
      socket.broadcast.emit("new_post", data);
    });
    socket.on("delete_post", async function (data) {
      socket.broadcast.emit("delete_post", data);
    });
    socket.on("toggle_like", async function (data) {
      socket.broadcast.emit("toggle_like", data);
    });
    socket.on("new_comment", async function (data) {
      socket.broadcast.emit("new_comment", data);
    });
    socket.on("delete_comment", async function (data) {
      socket.broadcast.emit("delete_comment", data);
    });
    socket.on("new_reply", async function (data) {
      socket.broadcast.emit("new_reply", data);
    });
    socket.on("delete_reply", async function (data) {
      socket.broadcast.emit("delete_reply", data);
    });
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
