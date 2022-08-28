const User = require("../models/user");
const Chatroom = require("../models/chatroom");

module.exports.userChats = async function (req, res) {
  try {
    let signInUserFriends;
    let signinfriend=[];
    if (req.user) {
      signInUserFriends = await User.findById(req.user._id).populate(
        "friendsList.friendId",
        "name email avatar"
      );
      signInUserFriends.friendsList.forEach((friend) => {
        signinfriend.push(friend.friendId);
      })
    }

    return res.render("chats", {
      title: "chats",
      friends: signinfriend,
    });
  } catch (err) {
    console.log("ERROR", err);
    return;
  }
};

module.exports.chatRoom = async function (req, res) {
  try {
    if (req.xhr) {
      let user = await User.findById(req.user._id).select("name email avatar");

      let friend = await User.findById(req.query.friend).select(
        "name email avatar"
      );

      let chatRoom;

      chatRoom = await Chatroom.findOne({
        user1: user._id,
        user2: friend._id,
      }).populate("messages");
      if (chatRoom == undefined) {
        chatRoom = await Chatroom.findOne({
          user1: friend._id,
          user2: user._id,
        }).populate("messages");
      }

      if (chatRoom == undefined) {
        chatRoom = await Chatroom.create({
          user1: user._id,
          user2: friend._id,
        });
      }

      return res.status(200).json({
        data: {
          chatRoom,
          friend,
          user,
        },
        message: "SUCCESS",
      });
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log("ERROR Bhai", err);
    return;
  }
};
