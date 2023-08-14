module.exports.votingSockets = function (socketServer) {
  let io = require("socket.io")(socketServer);
  io.sockets.on("connection", function (socket) {
    socket.on("disconnect", function () {});
  });
};
