const Post = require("../models/post");
const Comment = require("../models/comment");
const Like=require("../models/like");
const fs = require("fs");
const path = require("path");
module.exports.create = async (req, res) => {
  try {
    if(req.xhr){
      let post = await Post.create({
        content: req.body.content,
        user: req.user._id,
      });  
    
      // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
      post=await post.populate('user', 'name avatar')
      //post = await post.populate('user', 'name').execPopulate();
      return res.status(200).json({
        data:{
          post:post
        },
        message:"Post created !!!"
      })
    }
    Post.uploadedImage(req, res, async (err) => {
      if (err) {
        console.log(err);
        req.flash("error", err);
        return res.redirect("back");
      }
      console.log(req.file);
      let temp =Post.imagePath+'/'+req.file.filename;
      console.log(temp);
      await Post.create({
        content: req.body.content,
        user: req.user._id,
        image: temp,
      });
    })
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
      //CHANGE :: delete likes associated with this post and comment
      await Like.deleteMany({likeable: post, onModel: 'Post'});
      await Like.deleteMany({_id: {$in: post.comments}});
      post.remove();
      await Comment.deleteMany({ post: req.params.id });
      if(post.image){
        console.log(post.image)
        fs.unlinkSync(path.join(__dirname,"..",post.image));
      }
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
