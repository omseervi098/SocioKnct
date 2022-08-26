const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
//const Friend=require('../models/friend');
const async=require('async');
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
    let user=await User.findById(req.user._id).populate({path:'friendsList',
      populate:{path:'friendId'}});
    let friends=user.friendsList;
    //console.log(friends);
    let friendList=[];
    if(friends && friends.length>0){
      for(let i=0;i<friends.length;i++){
        friendList.push(friends[i].friendId);
      }
    }
    
    //console.log(friend_ids);
    //let friends_list=await User.find({_id:{$in:friend_ids}});
    //console.log(friends_list)
    //console.log(friends_list);
    return res.render("home", {
      title: "Home",
      posts: posts,
      users: users,
      friends:friendList,
      newfriend:req.user.request

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
module.exports.addFriend=function(req,res){
  var sent =[];
	var friends= [];
	var received= [];
	received= req.user.request;
	sent= req.user.sentRequest;
	friends= req.user.friendsList;
  User.find({username:{$ne:req.user.username}},function(err,result){
    if(err){
      console.log(err);
      return;
    }
    return res.render('search',{
      users:result,
      sent:sent,
      recieved:received,
      friends:friends,
      newfriend:req.user.request
    })
  })
}
module.exports.acceptFriend=async function(req,res){
  
  async.parallel([
		function(callback) {
			if(req.body.receiverName) {
					User.findOneAndUpdate({
						'username': req.body.receiverName,
						'request.userId': {$ne: req.user._id},
						'friendsList.friendId': {$ne: req.user._id}
					}, 
					{
						$push: {request: {
						userId: req.user.id,
						username: req.user.username
						}},
						$inc: {totalRequest: 1}
						},(err, count) =>  {
							console.log(err);
							callback(err, count);
						})
			}
		},
		function(callback) {
			if(req.body.receiverName){
					User.findByIdAndUpdate({
						'username': req.user.username,
						'sentRequest.username': {$ne: req.body.receiverName}
					},
					{
						$push: {sentRequest: {
						username: req.body.receiverName
						}}
						},(err, count) => {
						callback(err, count);
						})
			}
		}],
	(err, results)=>{
		res.redirect('/add-friend');
	});

			async.parallel([
				// this function is updated for the receiver of the friend request when it is accepted
				function(callback) {
					if (req.body.senderId) {
						User.findByIdAndUpdate({
							'_id': req.user.id,
							'friendsList.friendId': {$ne:req.body.senderId}
						},{
							$push: {friendsList: {
								friendId: req.body.senderId,
								friendName: req.body.senderName
							}},
							$pull: {request: {
								userId: req.body.senderId,
								username: req.body.senderName
							}},
							$inc: {totalRequest: -1}
						}, (err, count)=> {
							callback(err, count);
						});
					}
				},
				// this function is updated for the sender of the friend request when it is accepted by the receiver	
				function(callback) {
					if (req.body.senderId) {
						User.findByIdAndUpdate({
							'_id': req.body.senderId,
							'friendsList.friendId': {$ne:req.user.id}
						},{
							$push: {friendsList: {
								friendId: req.user.id,
								friendName: req.user.username
							}},
							$pull: {sentRequest: {
								username: req.user.username
							}}
						}, (err, count)=> {
							callback(err, count);
						});
					}
				},
				function(callback) {
					if (req.body.user_Id) {
						User.findByIdAndUpdate({
							'_id': req.user.id,
							'request.userId': {$eq: req.body.userId}
						},{
							$pull: {request: {
								userId: req.body.userId
							}},
							$inc: {totalRequest: -1}
						}, (err, count)=> {
							callback(err, count);
						});
					}
				},
				function(callback) {
					if (req.body.user_Id) {
						User.findByIdAndUpdate({
							'_id': req.body.user_Id,
							'sentRequest.username': {$eq: req.user.username}
						},{
							$pull: {sentRequest: {
								username: req.user.username
							}}
						}, (err, count)=> {
							callback(err, count);
						});
					}
				} 		
			],(err, results)=> {
				res.redirect('/add-friend');
			});
}
module.exports.autoComplete = async function (req, res) {
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
module.exports.search = async function (req, res) {
  var query=req.params.query;
  //find user emailand name and avatar
  let user=await User.find({name:new RegExp(query,'i')}).sort('-updatedAt').sort('-createdAt').limit(10);
  let newfriend=[]
  if(req.user){
    newfriend=req.user.request
  }
  return res.render('../views/search',{
    query:query,
    users:user,
     newfriend:newfriend,
  })
}


 module.exports.connect=async function(req,res){
//   try{
//     //Search for user in friend schema if present removing it or adding it
//     let from_user=req.body.from_user;
//     let to_user=req.body.to_user;
//     let friend=await Friend.findOne({
//       $or:[
//         {
//           from_user:from_user,to_user:to_user
//         },{
//           from_user:to_user,to_user:from_user
//         }
//       ]
//       });
//     //console.log(friend)
//     if(friend){
//       await Friend.findByIdAndDelete(friend._id);
//       //Find both users and remove reference to each other
//       let user1=await User.findByIdAndUpdate(from_user,{
//         $pull:{friends:friend._id},
//       });
//       let user2=await User.findByIdAndUpdate(to_user,{
//         $pull:{friends:friend._id},
//       });
//       return res.status(200).json({
//         message:'Removed as Friend',
//         data:{
//           to_user:to_user,
//           from_user:from_user,
//           delete:true
//         }
//       })
//     }else{
//       let newFriend=new Friend({
//         from_user:from_user,
//         to_user:to_user
//       });
//       await newFriend.save();
//       //Find both users and add to each other's friends list
//       let user1=await User.findByIdAndUpdate(from_user,{
//         $push:{friends:newFriend._id},
//       });
//       let user2=await User.findByIdAndUpdate(to_user,{
//         $push:{friends:newFriend._id},
//       });
//       return res.status(200).json({
//         message:'Added as Friend',
//         data:{
//           to_user:to_user,
//           from_user:from_user,
//           delete:false
//         }
//       })
//     }
//   }catch(err){
//     console.log(err);
//     return;
//   }
 }

