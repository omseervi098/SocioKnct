const Post=require('../models/post');
module.exports.home=function(req,res){
    Post.find({}).populate('user').exec((err,posts)=>{
        if(err){
            return console.log(err);
        }
        return res.render('home',{
            title:'Home',
            posts:posts
        });
    })
}