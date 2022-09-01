const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const newFriendRequest=require('../workers/friend_email_worker');
const friendMailer=require('../mailers/friends_mailer');
const async = require("async");
const { query } = require("express");
const Chat = require("../models/chat");
const ChatRoom = require("../models/chatroom");
module.exports.home = async function (req, res) {
  try {
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user", "name avatar email")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
        },
      });
    //console.log(posts.comments);
    let users = await User.find({}).select("-password");
    //Find all friends of the current user

    if (req.user) {
      let user = await User.findById(req.user._id).populate({
        path: "friendsList",
        populate: { path: "friendId" },
      });
      let friends = user.friendsList;
      //console.log(friends);
      let friendList = [];
      if (friends && friends.length > 0) {
        for (let i = 0; i < friends.length; i++) {
          friendList.push(friends[i].friendId);
        }
      }
      return res.render("home", {
        title: "Home",
        posts: posts,
        users: users,
        friends: friendList,
        newfriend: req.user.request,
      });
    } else {
      return res.render("home", {
        title: "Home",
        posts: posts,
        all_users: users,
      });
    }
  } catch (err) {
    console.log(err);
    return;
  }


};

module.exports.acceptFriend = function (req, res) {
  //console.log(req.user)
  
  async.parallel(
    [
      function (callback) {
        if (req.body.receiverName) {
          User.updateOne(
            {
              username: req.body.receiverName,
              "request.userId": { $ne: req.user._id },
              "friendsList.friendId": { $ne: req.user._id },
            },
            {
              $push: {
                request: {
                  userId: req.user.id,
                  username: req.user.username,
                },
              },
              $inc: { totalRequest: 1 },
            },
            (err, count) => {
              // console.log('searching for user');
             
              console.log(err);
              callback(err, count);
            }
          );
        }
      },
      function (callback) {
        if (req.body.receiverName) {
          User.updateOne(
            {
              username: req.user.username,
              "sentRequest.username": { $ne: req.body.receiverName },
            },
            {
              $push: {
                sentRequest: {
                  username: req.body.receiverName,
                },
              },
            },
            (err, count) => {
              let user = User.findOne({username:req.body.receiverName},(err,user)=>{
                
                newFriendRequest.add({
                email:user.email,
                curruser:{
                  name:req.user.name,
                  email:req.user.email,
                }
              })
              });
              
              callback(err, count);
            }
          );
        }
      },
    ],
    (err, results) => {
      res.redirect("back");
    }
  );

  async.parallel(
    [
      // this function is updated for the receiver of the friend request when it is accepted
      function (callback) {
        if (req.body.senderId) {
          User.updateOne(
            {
              '_id': req.user.id,
              "friendsList.friendId": { $ne: req.body.senderId },
            },
            {
              $push: {
                friendsList: {
                  friendId: req.body.senderId,
                  friendName: req.body.senderName,
                },
              },
              $pull: {
                request: {
                  userId: req.body.senderId,
                  username: req.body.senderName,
                },
              },
              $inc: { totalRequest: -1 },
            },
            (err, count) => {
              
              callback(err, count);
            }
          );
        }
      },
      // this function is updated for the sender of the friend request when it is accepted by the receiver
      function (callback) {
        if (req.body.senderId) {
          User.updateOne(
            {
              _id: req.body.senderId,
              "friendsList.friendId": { $ne: req.user.id },
            },
            {
              $push: {
                friendsList: {
                  friendId: req.user.id,
                  friendName: req.user.username,
                },
              },
              $pull: {
                sentRequest: {
                  username: req.user.username,
                },
              },
            },
            (err, count) => {
              //Send email to user when friend request is accepted
             
            
              callback(err, count);
            }
          );
        }
      },
      function (callback) {
        if (req.body.user_Id) {
          User.updateOne(
            {
              '_id': req.user._id,
              "request.userId": { $eq: req.body.user_Id },
            },
            {
              $pull: {
                request: {
                  userId: req.body.user_Id,
                },
              },
              $inc: { totalRequest: -1 },
            },
            (err, count) => {
              
              callback(err, count);
            }
          );
        }
      },
      function (callback) {
        if (req.body.user_Id) {
          User.updateOne(
            {
              _id: req.body.user_Id,
              "sentRequest.username": { $eq: req.user.username },
            },
            {
              $pull: {
                sentRequest: {
                  username: req.user.username,
                },
              },
            },
            (err, count) => {
              
              callback(err, count);
            }
          );
        }
      },
    ],
    (err, results) => {    
      res.redirect("back");
    }
  );
};
module.exports.autoComplete = async function (req, res) {
  try {
    //Check if query is valid regex
    var regex = new RegExp(req.query["term"], "i");
    if(!regex){
      return res.status(200).jsonp([]);
    }
    let user = await User.find({ name: regex }, { name: 1 })
      .sort("-updatedAt")
      .sort("-createdAt")
      .select("-password")
      .limit(10);

    var users = [];
    if (user && user.length > 0) {
      user.forEach((data) => {
        let obj = {
          id: data._id,
          label: data.name,
        };
        users.push(obj);
      });
    }
    //console.log(users);
    return res.status(200).jsonp(users);
  } catch (err) {
    console.log(err);
    return;
  }
};
module.exports.search = async function (req, res) {
  var query = req.params.query;
  //find user emailand name and avatar
  let sent = [];
  let friends = [];
  let received = [];
  
  if(req.user){
    received = req.user.request;
    req.user.sentRequest.forEach((data)=>{
      sent.push(data.username);
    })
    //PUSH friend name and id to array
    req.user.friendsList.forEach((data) => {
      friends.push(data.friendName);
    })
  }
  let user = await User.find({ name: new RegExp(query, "i") })
    .sort("-updatedAt")
    .sort("-createdAt")
    .select("-password")
    .limit(10);
  
  return res.render("search", {
    query: query,
    users: user,
    sent: sent,
    recieved: received,
    friend: friends,
    newfriend: received
  });
};
//Check if request is accepted or not
module.exports.checkRequest = async function (req, res) {
  let user = await User.findOne({
    _id: req.user._id,
    "request.userId": req.params.id,
  });
  if (user) {
    return res.status(200).jsonp(true);
  } else {
    return res.status(200).jsonp(false);
  }
}


module.exports.removeFriend = async function (req, res) {
  try {
    //this will be used to remove two users from each other's friend list
    let user = await User.findByIdAndUpdate(
      {
        _id: req.body.from_user,
        "friendsList.friendId": { $eq: req.body.to_user },
      },
      {
        $pull: {
          friendsList: {
            friendId: req.body.to_user,
          },
        },
      }
    );
    let temp=req.body.from_user;
    let from_user=user.username;
    let user1 = await User.findByIdAndUpdate(
      {
        _id: req.body.to_user,
        "friendsList.friendId": { $eq: req.body.from_user },
      },
      {
        $pull: {
          friendsList: {
            friendId: req.body.from_user,
          },
        },
      }
    );
    
    //Find All Chats between two users and delete them
    let chat = await Chat.deleteMany({
      'user':req.body.from_user
    });
    let chat1= await Chat.deleteMany({
      'user':req.body.to_user,
    });
    //Delete chat room between two users
    let chatroom = await ChatRoom.deleteMany({
      $or:[
        {
          'user1':req.body.from_user,
          'user2':req.body.to_user
        },
        {
          'user1':req.body.to_user,
          'user2':req.body.from_user
        }
      ]
    })
    let to_user=user1.username;
   
    //console.log(user.friendsList)
    //console.log(user1.friendsList)
    return res.status(200).json({
      message: "success",
      data: {
        to_user: to_user,
        from_user: from_user,
      },
    });
  } catch (err) {
    console.log(err);
    return;
  }
};
