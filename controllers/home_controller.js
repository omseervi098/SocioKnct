const Post=require('../models/post');
module.exports.home=function(req,res){
    Post.find({},(err,posts)=>{
        return res.render('home',{
            title:'Home',
            posts:posts
        });
    })
}