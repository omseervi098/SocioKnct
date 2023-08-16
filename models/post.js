const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const IMAGE_PATH = path.join("/uploads/posts/images");
const VIDEO_PATH = path.join("/uploads/posts/videos");
const AUDIO_PATH = path.join("/uploads/posts/audios");
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
    audio: {
      type: String,
    },
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    //Include array of id of comments itself
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    //Include array of id of likes
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
  },
  {
    timestamps: true,
  }
);
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname == "video") {
      //check if videos folder exists
      if (!fs.existsSync(path.join(__dirname, "..", VIDEO_PATH))) {
        fs.mkdirSync(path.join(__dirname, "..", VIDEO_PATH));
      }
      cb(null, path.join(__dirname, "..", VIDEO_PATH));
    } else if (file.fieldname == "audio") {
      //check if audios folder exists
      if (!fs.existsSync(path.join(__dirname, "..", AUDIO_PATH))) {
        fs.mkdirSync(path.join(__dirname, "..", AUDIO_PATH));
      }
      cb(null, path.join(__dirname, "..", AUDIO_PATH));
    } else {
      //check if images folder exists
      if (!fs.existsSync(path.join(__dirname, "..", IMAGE_PATH))) {
        fs.mkdirSync(path.join(__dirname, "..", IMAGE_PATH));
      }
      cb(null, path.join(__dirname, "..", IMAGE_PATH));
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
postSchema.statics.uploadedAudio = multer({
  //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) {
    console.log("file filter");
    var ext = path.extname(file.originalname);
    callback(null, true);
  },
  limits: {
    fileSize: "10MB",
  },
}).single("audio");

postSchema.statics.uploadedVideo = multer({
  //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) {
    console.log("file filter");
    var ext = path.extname(file.originalname);
    callback(null, true);
  },
  limits: {
    fileSize: "10MB",
  },
}).single("video");

postSchema.statics.uploadedImage = multer({
  //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    console.log("file filter", file.destination);
    callback(null, true);
  },
  limits: {
    fileSize: "5MB",
  },
}).single("image");

postSchema.statics.imagePath = IMAGE_PATH;
postSchema.statics.videoPath = VIDEO_PATH;
postSchema.statics.audioPath = AUDIO_PATH;
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
