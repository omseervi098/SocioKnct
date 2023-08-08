const Comment = require("../models/comment");
const Post = require("../models/post");
const Like = require("../models/like");
const CommentReply = require("../models/commentreply");
const commentMailer = require("../mailers/comments_mailer");
const emailQueue = require("../workers/comment_email_worker");
module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      post.comments.push(comment);
      post.save();
      comment = await comment.populate("user", "name email avatar");
      // comment = await comment.populate("replies", "content user comment post");
      //populate user of post
      post = await post.populate("user", "email");
      let data = {
        comment: comment,
        post: post,
      };
      // /emailQueue.add(data);
      //console.log(comment.user.name);
      if (req.xhr) {
        console.log("xhr");
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Comment created !!!",
        });
      }
      req.flash("success", "Comment created !!!");
      res.redirect("/");
    }
  } catch (err) {
    req.flash("error", "Error in creating comment");
    console.log(err);
    return;
  }
};
module.exports.createReply = async function (req, res) {
  try {
    let comment = await Comment.findById(req.body.comment);
    if (comment) {
      let reply = await CommentReply.create({
        content: req.body.content,
        comment: req.body.comment,
        post: req.body.post,
        user: req.user._id,
      });
      comment.replies.push(reply);
      comment.save();
      reply = await reply.populate("user", "name email avatar");
      //populate user of post
      comment = await comment.populate("replies", "content user comment post");

      let data = {
        reply: reply,
        comment: comment,
      };
      //console.log(comment.user.name);
      if (req.xhr) {
        console.log("xhr");
        return res.status(200).json({
          data: data,
          message: "Reply created !!!",
        });
      }
      req.flash("success", "Reply created !!!");
      res.redirect("/");
    }
  } catch (err) {
    req.flash("error", "Error in creating Reply");
    console.log(err);
    return;
  }
};
module.exports.destroyReply = async function (req, res) {
  try {
    let reply = await CommentReply.findById(req.params.id);
    if (reply.user == req.user.id) {
      //destroy reply from comment.replies
      let commentId = reply.comment;
      //delete reply itself
      reply.remove();
      let comment = await Comment.findByIdAndUpdate(commentId, {
        $pull: { replies: req.params.id },
      });
      // delete all likes on this reply
      await Like.deleteMany({ likeable: reply._id, onModel: "CommentReply" });
      if (req.xhr) {
        return res.status(200).json({
          data: {
            reply_id: req.params.id,
          },
          message: "Reply deleted !!!",
        });
      }
      req.flash("success", "Reply deleted !!!");
      return res.redirect("/");
    } else {
      req.flash("error", "You are not authorized to delete this reply");
    }
  } catch (err) {
    req.flash("error", "Error in deleting Reply");
    console.log(err);
    return;
  }
};
module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);
    if (comment.user == req.user.id) {
      //destroy comment and pull from post
      let postId = comment.post;
      //delete comment itself
      comment.remove();
      //delete comment from post.comments
      let post = await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });
      //  delete all likes on this comment
      await Like.deleteMany({ likeable: comment, onModel: "Comment" });
      // delete all likes on the replies of this comment
      await Like.deleteMany({ likeable: { $in: comment.replies } });
      //destroy all its replies
      await CommentReply.deleteMany({ comment: req.params.id });
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Comment deleted !!!",
        });
      }
      req.flash("success", "Comment deleted !!!");
      return res.redirect("/");
    } else {
      req.flash("error", "You are not authorized to delete this comment");
      return res.redirect("/");
    }
  } catch (err) {
    req.flash("error", "Error in deleting comment");
    console.log(err);
    return;
  }
};
