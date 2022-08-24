const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

module.exports.home = async function (req, res) {
  try {
    let posts = await Post.find({})
      .sort('-createdAt')
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user likes"
        }
      });
      //console.log(posts.comments);
    let users = await User.find({});
    return res.render("home", {
      title: "Home",
      posts: posts,
      all_users: users,
    });
  } catch(err){
    console.log(err);
    return;
  }

  //Using Promises
  // Post.find({}).exec()
  //post.then()
};

module.exports.search = async function (req, res) {
  try{
    var regex=new RegExp(req.query["term"],'i');
    let user=await User.find({name:regex},{'name':1}).sort('-updatedAt').sort('-createdAt').limit(10);
    
    var users=[];
    if(user && user.length>0){
      user.forEach(data=>{
        let obj={
          id:data._id,
          label:data.name,
        }
        users.push(obj);
      })
    }
    //console.log(users);
    return res.status(200).jsonp(users);
  }catch(err){
    console.log(err);
    return;
  }
  

}