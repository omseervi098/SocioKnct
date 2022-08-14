const Post=require('../models/post');
const Comment=require('../models/comment');
module.exports.create=(req,res)=>{
    Post.create({
        content:req.body.content,
        user:req.user._id
    },(err,post)=>{
        if(err){
            return console.log(err);
        }
        return res.redirect('/');
    })
}

module.exports.destroy=(req,res)=>{
    Post.findById(req.params.id,(err,post)=>{
        //.id means converting object into string
        if(post.user=req.user.id){
            post.remove();
            
            Comment.deleteMany({post:req.params.id},(err)=>{
                return res.redirect('/');
            })
        }else{
            return res.redirect('/');  
        }
    })
}