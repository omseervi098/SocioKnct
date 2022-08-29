let chatArea=$('#chatbox')
let selfUser;
let userMail;
let otherUser;
let currentChatRoom;
let roomList = [];

var socket = io.connect("http://localhost:5000");

socket.on("connect", function () {
  console.log("connection established using sockets...!");
});

function joinRoom() {
  socket.emit("join_room", {
    user_email: userMail,
    chatroom: currentChatRoom,
  });

  socket.on("user_joined", function (data) {
    console.log("New User Joined", data);
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
  console.log("Message Received", data);
  let messageList = $(`#chat-messages-list-${currentChatRoom}`);
  console.log(messageList)
  if (data.user_email === userMail) {
    console.log('self user')
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
                ${friend.avatar?
                  `<img src="${friend.avatar}" />`
                  :`<img src="/images/default-avatar.png" />`
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
                    :`
                    <div class="message-box-holder">
                        <div class="message-sender">
                            ${friend.name}
                        </div>
                        <div class="message-box message-partner">
                            ${chat.message}
                        </div>
                    </div>`
                    }`;
              }).join("")
            }
        </div>
        <div class="chat-input-holder">
            <input type="text" class="chat-input" placeholder="Type Here..."></input>
            <input type="submit" value="Send" class="message-send" />
        </div>
    
    </div>`;
}
function minimize() {
  console.log("clicked")
  
  $('.chatbox').toggleClass('chatbox-min');
};
function hide() {
  $("#chatbox").css("display", "none");

  $('.chatbox').hide();
};
$(".message-btn").each(function () {
  
    console.log('#message-btn');
  $(this).click(function () {
    $("#chatbox").css("display", "flex");
   console.log($(this),"clicked")
    const friendId = $(this).attr("data-friendId");
    $.ajax({
      type: "GET",
      url: `/messages/chatroom?friend=${friendId}`,
      success: function (data) {
        let { chatRoom, friend, user } = data.data;
        let room = createArea(chatRoom, friend, user);
        chatArea.empty();
        $('#chatbox').append(room);
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
  console.log(list)
  //Scroll to the bottom of the messages div
  list.scrollTop = list.scrollHeight;
}

function tempClass(friendId) {
  $("#roomlist > div").removeClass("temporary-highlight");
  $(`#friend-${friendId}`).addClass("temporary-highlight");
}

// class ChatEngine{
//     constructor(chatBoxId,userId){
//         this.chatBox = $(`#${chatBoxId}`);
//         this.userId = userId;

//         this.socket = io.connect('http://15.207.84.232:5000');

//         if(this.userId){
//             this.connectionHandler();
//         }
//     }

//     connectionHandler(){
//         let self = this;

//         this.socket.on('connect',function(){
//             console.log("Connection established using sockets...!");

//             self.socket.emit('join_room',{
//                 user_email : self.userId,
//                 chatroom : 'codeial'
//             });

//             self.socket.on('user_joined',function(data){
//                 console.log('New User Joined',data);
//             });

//         });

//         $('#send-message').click(function(){
//             let msg = $('#chat-message-input').val();

//             if(msg!=''){
//                 self.socket.emit('send_message',{
//                     message : msg,
//                     user_email : self.userId,
//                     chatroom : 'codeial'
//                 });
//             }
//         });

//         self.socket.on('receive_message',function(data){
//             console.log('message received', data.message);

//             let newMessage = $("<li>");
//             let messageType = 'other-message';

//             if(data.user_email==self.userId){
//                 messageType = 'self-message';
//             }

//             if(messageType=='self-mssage'){
//                 newMessage.append(`
//                     <div>
//                         <h3> ${data.message} </h3>
//                         <h4> ${data.user_email} </h4>
//                     </div>
//                 `);
//             }
//             else{
//                 newMessage.append(`
//                 <div>
//                     <h3> ${data.message} </h3>
//                     <h4> ${data.user_email} </h4>
//                 </div>
//             `);
//             }

//             // newMessage.append($('<span>', {
//             //     'html': data.message
//             // }));

//             // newMessage.append($('<sub>', {
//             //     'html': data.user_email
//             // }));

//             newMessage.addClass(messageType);

//             $('#chat-messages-list').append(newMessage);
//         })
//     }
// }
