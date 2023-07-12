const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const IMAGE_PATH = path.join("/uploads/posts/images");
const VIDEO_PATH = path.join("/uploads/posts/videos");
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
      cb(null, path.join(__dirname, "..", VIDEO_PATH));
    } else cb(null, path.join(__dirname, "..", IMAGE_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

postSchema.statics.uploadedVideo = multer({
  //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) {
    console.log("file filter");
    var ext = path.extname(file.originalname);
    callback(null, true);
  },
  limits: {
    fileSize: "50MB",
  },
}).single("video");

postSchema.statics.uploadedImage = multer({
  //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);

    callback(null, true);
  },
  limits: {
    fileSize: "5MB",
  },
}).single("image");

postSchema.statics.imagePath = IMAGE_PATH;
postSchema.statics.videoPath = VIDEO_PATH;
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
