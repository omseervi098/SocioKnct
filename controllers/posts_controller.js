const Post = require("../models/post");
const Comment = require("../models/comment");
module.exports.create = async (req, res) => {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    if(req.xhr){
      // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
      post=await post.populate('user', 'name')
      //post = await post.populate('user', 'name').execPopulate();
      return res.status(200).json({
        data:{
          post:post
        },
        message:"Post created !!!"
      })
    }
    req.flash("success", "Post created !!!");
    return res.redirect("/");
  } catch (err) {
    req.flash("error", "Error in creating post");
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
      if(req.xhr){
        return res.status(200).json({
          data:{
            post_id:req.params.id
          },
          message:"Post deleted !!!"
        })
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
