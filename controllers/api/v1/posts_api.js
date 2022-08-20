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
      //.id means converting object into string
      //if ((post.user = req.user.id)) {
        post.remove();
        await Comment.deleteMany({ post: req.params.id });
        
        //req.flash("success", "Post deleted !!!");
        return res.json(200,{
            message:'Post deleted'
        });
      
    } catch (err) {
      //req.flash("error", "Error in deleting post");

      return res.json(500,{
        message:'Error in deleting post',
      });
    }
  };
  