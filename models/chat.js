const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
