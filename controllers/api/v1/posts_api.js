const Post=require('../../../models/post');
const Comment=require('../../../models/comment');
module.exports.index=async function(req,res){
    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user','-password')
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });
    return res.json(200,{
        message:'List of post',
        post:posts
    })
}

module.exports.destroy = async (req, res) => {
    try {
      let post = await Post.findById(req.params.id);
      if ((post.user = req.user.id)) {
        post.remove();
        await Comment.deleteMany({ post: req.params.id });
        
        //req.flash("success", "Post deleted !!!");
        return res.status(200).json({
            message:'Post deleted'
        });
      } else {
        return res.status(401).json({
          message: "You are not authorized to delete this post",
        });
      }
      
    } catch (err) {
      //req.flash("error", "Error in deleting post");

      return res.status(500).json({
        message:'Error in deleting post',
      });
    }
  };
  