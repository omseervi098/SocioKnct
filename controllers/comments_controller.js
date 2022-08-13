const Comment=require('../models/comment');
const Post=require('../models/post');
module.exports.create=function(req,res){
    //add Comment to the database
    Post.find(req.body.post,(err,post)=>{
        if(post){
            Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:req.body.post
            },(err,comment)=>{
                if(err){
                    console.log('Error in creating comment');
                    return;
                }
                post.comments.push(comment);
                post.save();//Whenever update always save
                res.redirect('/');
            });
        }
    })
}
