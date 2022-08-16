const Post = require("../models/post");
const Comment = require("../models/comment");
module.exports.create = async (req, res) => {
  try {
    let posts = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    return res.redirect("/");
  } catch (err) {
    console.log(err);
    return;
  }
};

module.exports.destroy = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    //.id means converting object into string
    if ((post.user = req.user.id)) {
      post.remove();
      await Comment.deleteMany({ post: req.params.id });
      return res.redirect("/");
    } else {
      return res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    return;
  }
};
