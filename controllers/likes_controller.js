const Like = require("../models/like");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const CommentReply = require("../models/commentreply");
module.exports.toggleLike = async function (req, res) {
  try {
    //link -- likes/toggle/?id=addas&type=Post
    let likeable;
    let deleted;
    if (req.query.type == "Post") {
      likeable = await Post.findById(req.query.id).populate("likes");
    } else if (req.query.type == "Comment") {
      likeable = await Comment.findById(req.query.id).populate("likes");
    } else {
      likeable = await CommentReply.findById(req.query.id).populate("likes");
    }
    //Check if like already exists
    let existingLike = await Like.findOne({
      likeable: req.query.id,
      onModel: req.query.type,
      user: req.user._id,
    });
    //If a like already exist then delete it
    if (existingLike) {
      likeable.likes.pull(existingLike._id);
      likeable.save();
      existingLike.remove();
      deleted = true;
    } else {
      //If no like exists then create one
      let newLike = await Like.create({
        user: req.user._id,
        likeable: req.query.id,
        onModel: req.query.type,
      });

      likeable.likes.push(newLike._id);
      likeable.save();
    }
    return res.status(200).json({
      message: "Like toggled",
      data: {
        deleted: deleted,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
