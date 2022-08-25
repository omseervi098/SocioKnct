const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Friend=require('../models/friend');
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
    //Find all friends of the current user
    
   if(req.user){
    let friends=await Friend.find({from_user:req.user._id});
    
    let friend_ids=[];
    friends.forEach(friend=>{
      friend_ids.push(friend.to_user);
    });
    let friendto=await Friend.find({to_user:req.user._id});
    friendto.forEach(friend=>{
      friend_ids.push(friend.from_user);
    })
    //console.log(friend_ids);
    let friends_list=await User.find({_id:{$in:friend_ids}});
    console.log(friends_list)
    //console.log(friends_list);
    return res.render("home", {
      title: "Home",
      posts: posts,
      users: users,
      friends:friends_list
    });
   }else{
    return res.render("home", {
      title: "Home",
      posts: posts,
      all_users: users,
    });
  }
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
module.exports.connect=async function(req,res){
  try{
    //Search for user in friend schema if present removing it or adding it
    let from_user=req.body.from_user;
    let to_user=req.body.to_user;
    let friend=await Friend.findOne({
      $or:[
        {
          from_user:from_user,to_user:to_user
        },{
          from_user:to_user,to_user:from_user
        }
      ]
      });
    //console.log(friend)
    if(friend){
      await Friend.findByIdAndDelete(friend._id);
      //Find both users and remove reference to each other
      let user1=await User.findByIdAndUpdate(from_user,{
        $pull:{friends:friend._id},
      });
      let user2=await User.findByIdAndUpdate(to_user,{
        $pull:{friends:friend._id},
      });
      return res.status(200).json({
        message:'Removed as Friend',
        data:{
          to_user:to_user,
          from_user:from_user,
          delete:true
        }
      })
    }else{
      let newFriend=new Friend({
        from_user:from_user,
        to_user:to_user
      });
      await newFriend.save();
      //Find both users and add to each other's friends list
      let user1=await User.findByIdAndUpdate(from_user,{
        $push:{friends:newFriend._id},
      });
      let user2=await User.findByIdAndUpdate(to_user,{
        $push:{friends:newFriend._id},
      });
      return res.status(200).json({
        message:'Added as Friend',
        data:{
          to_user:to_user,
          from_user:from_user,
          delete:false
        }
      })
    }
  }catch(err){
    console.log(err);
    return;
  }
}

