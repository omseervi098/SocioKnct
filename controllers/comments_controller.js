const Comment = require('../models/comment');
const Post = require('../models/post');
const { post } = require('../routes/comments');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){

        if (post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){
                // handle error

                post.comments.push(comment);
                post.save();

                res.redirect('/');
            });
        }

    });
}
module.exports.destroy = function(req, res){
    Comment.findById(req.params.id,(err,comment)=>{
        if(comment.user==req.user.id){
            let postId=comment.post;
            console.log()
            comment.remove();
            Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},(err)=>{
                return res.redirect('/');
            });
        }else{
            return res.redirect('/');
        }
    })
}
