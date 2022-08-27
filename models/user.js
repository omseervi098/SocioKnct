const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const AVATAR_PATH = path.join("/uploads/users/avatars");
const Friend = require("../models/friend");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      //select: false,
    },
    name: {
      type: String,
      lowercase: true,
      capitalize: true,
      required: true,
    },
    avatar: {
      type: String,
    },
    sentRequest: [
      {
        username: { type: String, default: "" },
      },
    ],
    request: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: { type: String, default: "" },
      },
    ],
    totalRequest: { type: Number, default: 0 },
    friendsList: [
      {
        friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        friendName: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", AVATAR_PATH));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
//Static Function to get path of the avatar
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single(
  "avatar"
);
userSchema.statics.avatarPath = AVATAR_PATH;
const User = mongoose.model("User", userSchema);
module.exports = User;
