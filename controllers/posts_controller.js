const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const CommentReply = require("../models/commentreply");
const cloudinary = require("../config/cloudinary");
const Poll = require("../models/poll");
module.exports.vote = async (req, res) => {
  try {
    //find poll using poll id
    let poll = await Poll.findById(req.body.pollId);
    //check if user has already voted
    if (poll.votedBy.includes(req.body.userId)) {
      return res.status(200).json({
        message: "You have already voted",
      });
    } else {
      //push user id in votedBy array
      poll.votedBy.push(req.body.userId);
      //find option id using option id
      let option = poll.options.id(req.body.optionId);
      //push vote id in votes array
      option.votes.push(req.body.userId);
      //increase total votes
      poll.totalVotes += 1;
      //update percentage of each option
      poll.options.forEach((option) => {
        option.percentage = (
          (option.votes.length / poll.totalVotes) *
          100
        ).toFixed(2);
      });
      //save poll
      poll.save();
      return res.status(200).json({
        data: {
          poll: poll,
        },
        message: "Vote added",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.create = async (req, res) => {
  if (req.xhr) {
    //multpart form data
    console.log(req.query);
    if (req.query.poll == "true") {
      let options = [];
      for (let i = 1; i <= 4; i++) {
        if (req.body[`answer${i}`]) {
          options.push({
            text: req.body[`answer${i}`],
            votes: [],
          });
        }
      }
      let poll = await Poll.create({
        question: req.body.question,
        options: options,
      });
      let post = await Post.create({
        content: req.body.content,
        user: req.user._id,
        poll: poll._id,
      });
      post = await post.populate("user", "name avatar");
      post = await post.populate(
        "poll",
        "question options totalVotes percentage votes votedBy"
      );
      return res.status(200).json({
        data: {
          post: post,
          locals: {
            user: req.user,
          },
        },
        message: "Post created !!!",
      });
    } else if (req.query.video == "true") {
      await Post.uploadedVideo(req, res, async (err) => {
        let temp = path.join(Post.videoPath, req.file.filename);
        console.log(temp);
        let url = temp;
        let post = await Post.create({
          content: req.body.content,
          user: req.user._id,
          video: url,
        });
        post = await post.populate("user", "name avatar");
        return res.status(200).json({
          data: {
            post: post,
            locals: {
              user: req.user,
            },
          },
          message: "Post created !!!",
        });
      });
    } else if (req.query.audio == "true") {
      await Post.uploadedAudio(req, res, async (err) => {
        let temp = path.join(Post.audioPath, req.file.filename);
        console.log(temp);
        let url = temp;
        let post = await Post.create({
          content: req.body.content,
          user: req.user._id,
          audio: url,
        });
        post = await post.populate("user", "name avatar");
        return res.status(200).json({
          data: {
            post: post,
            locals: {
              user: req.user,
            },
          },
          message: "Post created !!!",
        });
      });
    } else if (req.query.image == "true") {
      await Post.uploadedImage(req, res, async (err) => {
        let temp = path.join(Post.imagePath, req.file.filename);
        let url = temp;
        let post = await Post.create({
          content: req.body.content,
          user: req.user._id,
          image: url,
        });
        post = await post.populate("user", "name avatar");

        return res.status(200).json({
          data: {
            post: post,
            locals: {
              user: req.user,
            },
          },
          message: "Post created !!!",
        });
      });
    } else {
      let post = await Post.create({
        content: req.body.content,
        user: req.user._id,
      });
      post = await post.populate("user", "name avatar");
      return res.status(200).json({
        data: {
          post: post,
          locals: {
            user: req.user,
          },
        },
        message: "Post created !!!",
      });
    }
    // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
    // post = await post.populate("user", "name avatar");
    //post = await post.populate('user', 'name').execPopulate();
  } else {
    try {
      //FILE VALIDATION
      console.log("Not xhr", req);
      await Post.uploadedImage(req, res, async (err) => {
        let temp = Post.imagePath + "/" + req.file.filename;
        console.log(temp);
        await Post.create({
          content: req.body.content,
          user: req.user._id,
          image: temp,
        });
      });
      req.flash("success", "Post created !!!");
      return res.redirect("back");
    } catch (err) {
      req.flash("error", "Error in creating post");
      console.log(err);
      return;
    }
  }
};

module.exports.destroy = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    //.id means converting object into string
    if ((post.user = req.user.id)) {
      //delete likes on post
      await Like.deleteMany({ likeable: post, onModel: "Post" });
      //delete likes on comments
      await Like.deleteMany({ likeable: { $in: post.comments } });
      //likes on replies
      await Like.deleteMany({ likeable: { $in: post.comments.replies } });
      //get all replies of post
      let replies = await CommentReply.find({ post: req.params.id });
      //delete likes on replies
      await Like.deleteMany({ likeable: { $in: replies } });
      //delete replies
      await CommentReply.deleteMany({ post: req.params.id });
      //delete comments
      await Comment.deleteMany({ post: req.params.id });
      //delete post itself
      post.remove();
      if (post.image) {
        fs.unlinkSync(path.join(__dirname, "..", post.image));
      }
      if (post.video) {
        fs.unlinkSync(path.join(__dirname, "..", post.video));
      }
      if (post.audio) {
        fs.unlinkSync(path.join(__dirname, "..", post.audio));
      }
      if (post.poll) {
        await Poll.findByIdAndDelete(post.poll);
      }
      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post deleted !!!",
        });
      }
      req.flash("success", "Post deleted !!!");
      return res.redirect("/");
    } else {
      req.flash("error", "You are not authorized to delete this post");
      return res.redirect("/");
    }
  } catch (err) {
    req.flash("error", "Error in deleting post");
    return;
  }
};
