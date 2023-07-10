let chatArea = $("#chatbox");
let selfUser;
let userMail;
let otherUser;
let currentChatRoom;
let roomList = [];
// For development use http://localhost:3001
// For production use https://socioknct.tech
var socket = io.connect("http://localhost:3001", {
  transports: ["websocket"],
});
socket.on("connect", function () {
  console.log("connection established using sockets...!");
});

function joinRoom() {
  socket.emit("join_room", {
    user_email: userMail,
    chatroom: currentChatRoom,
  });

  socket.on("user_joined", function (data) {
    console.log("New User Joined");
  });
}

var sendMessage = () => {
  function activateMessageSending() {
    let inputBox = $(".chat-input");
    let msg = inputBox.val();

    if (msg != "") {
      socket.emit("send_message", {
        message: msg,
        user_id: selfUser._id,
        user_email: userMail,
        chatroom: currentChatRoom,
      });
      //reload chat

      inputBox.val("");
    }
  }

  $(".message-send").submit(activateMessageSending); // click action

  $(".chat-input").keydown(function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      activateMessageSending();
    }
  });
};

function connectRoom() {
  if (!roomList.includes(currentChatRoom)) {
    joinRoom();
    roomList.push(currentChatRoom);
  }

  sendMessage();
}

socket.on("receive_message", function (data) {
  let messageList = $(`#chat-messages-list-${currentChatRoom}`);

  if (data.user_email === userMail) {
    messageList.append(
      `
        <div class="message-box-holder">
          <div class="message-box">
             ${data.message}
          </div>
        </div>
        `
    );
  } else {
    messageList.append(`
    <div class="message-box-holder">
        <div class="message-sender">
            ${otherUser.name}
        </div>
        <div class="message-box message-partner">
            ${data.message}
        </div>
    </div>
    `);
  }
  scrollBottom();
});

function createArea(chatRoom, friend, user) {
  return `<div class="chatbox-holder">
    <div class="chatbox">
        <div class="chatbox-top">
            <div class="chatbox-avatar">
                <a >
                ${
                  friend.avatar
                    ? `<img src="${friend.avatar}" />`
                    : `<img src="/images/default-avatar.png" />`
                }
                </a>
            </div>
            <div class="chat-partner-name">
                <span class="status online"></span>
                <a>${friend.name}</a>
            </div>
            
            <div class="chatbox-icons">
                <i onclick="minimize()" class="fa fa-minus"></i>
                <i onclick="hide()" class="fa fa-close"></i>
            </div>
            </div>
            <div class="chat-messages" id="chat-messages-list-${chatRoom._id}">
            ${chatRoom.messages
              .map((chat) => {
                return `${
                  chat.user === user._id
                    ? `<div class="message-box-holder">
                       <div class="message-box">
                           ${chat.message}
                        </div>
                        </div>`
                    : `
                    <div class="message-box-holder">
                        <div class="message-sender">
                            ${friend.name}
                        </div>
                        <div class="message-box message-partner">
                            ${chat.message}
                        </div>
                    </div>`
                }`;
              })
              .join("")}
        </div>
        <div class="chat-input-holder">
            <input type="text" class="chat-input" placeholder="Type Here..."></input>
            <input type="submit" value="Send" class="message-send" />
        </div>
    
    </div>`;
}
function minimize() {
  $(".chatbox").toggleClass("chatbox-min");
}
function hide() {
  $("#chatbox").css("display", "none");

  $(".chatbox").hide();
}
$(".message-btn").each(function () {
  $(this).click(function () {
    $("#chatbox").css("display", "flex");

    const friendId = $(this).attr("data-friendId");
    $.ajax({
      type: "GET",
      url: `/messages/chatroom?friend=${friendId}`,
      success: function (data) {
        let { chatRoom, friend, user } = data.data;
        let room = createArea(chatRoom, friend, user);
        chatArea.empty();
        $("#chatbox").append(room);
        scrollBottom();
        selfUser = user;
        otherUser = friend;
        currentChatRoom = chatRoom._id;
        userMail = user.email;

        connectRoom();
        //changeScreen();
        //arrow();
        //tempClass(friendId);
      },
      error: function (error) {
        console.log(error.responseText);
      },
    });
  });
});

function arrow() {
  $(".back-button").click(() => {
    $("#chatbox").css("display", "none");
    $("#chatbox").css({ display: "block", width: "100%" });
  });
}

function changeScreen() {
  if (window.innerWidth <= 430) {
    $("#chatbox").css({ display: "block", width: "100%" });
    $("#chatbox").css("display", "none");
  }
}

function scrollBottom() {
  let list = document.getElementsByClassName("chat-messages")[0];

  //Scroll to the bottom of the messages div
  list.scrollTop = list.scrollHeight;
}

function tempClass(friendId) {
  $("#roomlist > div").removeClass("temporary-highlight");
  $(`#friend-${friendId}`).addClass("temporary-highlight");
}
