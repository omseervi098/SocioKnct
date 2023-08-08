const mongoose = require("mongoose");
const commentReplySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    //Reference to user and  comment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
  },
  { timestamps: true }
);

const CommentReply = mongoose.model("CommentReply", commentReplySchema);
module.exports = CommentReply;
