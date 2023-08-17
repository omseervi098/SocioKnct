let chatArea = $("#chatbox");
let selfUser;
let userMail;
let otherUser;
let currentChatRoom;
let roomList = [];
// For development use http://localhost:3001
// For production use https://www.socioknct.tech
var socket = io.connect("https://www.socioknct.tech", {
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

var sendMessage = () => {};

function connectRoom() {
  if (!roomList.includes(currentChatRoom)) {
    joinRoom();
    roomList.push(currentChatRoom);
  }

  sendMessage();
}

socket.on("receive_message", function (data) {
  let time =
    new Date(data.timestamp).toLocaleTimeString().split(":")[0] +
    ":" +
    new Date(data.timestamp).toLocaleTimeString().split(":")[1] +
    " " +
    new Date(data.timestamp).toLocaleTimeString().split(" ")[1];

  let messageList = $(`#chat-messages-list-${data.chatroom}`);

  if (data.user_email === userMail) {
    messageList.append(`
    <div class="d-flex justify-content-end text-end mb-1">
      <div class="w-100">
        <div class="d-flex flex-column align-items-end">
          <div class="bg-primary text-white p-2 px-3 rounded-2">${data.message}</div>
          <!-- Images -->
          <div class="d-flex my-2">
            <div class="small text-secondary">${time}</div>
            <div class="small ms-2"><i class="fa-solid fa-check"></i></div>
          </div>
        </div>
      </div>
    </div>`);
  } else {
    messageList.append(
      `<div class="d-flex mb-1">
          <div class="flex-shrink-0 avatar avatar-xs me-2">
            <img class="avatar-img rounded-circle" src="${
              data.user.avatar ? data.user.avatar : "/images/default-avatar.png"
            }" alt="">
          </div>
          <div class="flex-grow-1">
            <div class="w-100">
              <div class="d-flex flex-column align-items-start">
                <div class="bg-light text-secondary p-2 px-3 rounded-2">${
                  data.message
                }</div>
                <div class="small my-2">${time}</div>
              </div>
            </div>
          </div>
        </div>
    `
    );
  }
  scrollBottom();
});

function createArea(chatRoom, friend, user) {
  return `
        <!-- Chat toast START -->
        <div id="chatToast-${
          friend._id
        }" class="toast mb-0 bg-mode" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
          <div class="toast-header bg-mode">
            <!-- Top avatar and status START -->
            <div class="d-flex justify-content-between align-items-center w-100">
              <div class="d-flex">
                <div class="flex-shrink-0 avatar me-2">
                  <img class="avatar-img rounded-circle" src="${
                    friend.avatar ? friend.avatar : "/images/default-avatar.png"
                  }" alt="">
                </div>
                <div class="flex-grow-1">
                  <h6 class="mb-0 mt-1">${friend.name}</h6>
                  <div class="small text-secondary"><i class="fa-solid fa-circle text-success me-1"></i>Online</div>
                </div>
              </div>
              <div class="d-flex">
                <!-- Call button -->
                <div class="dropdown">
                  <a class="btn btn-secondary-soft-hover py-1 px-2" href="#" id="chatcoversationDropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false"><i class="fa-solid fa-ellipsis-vertical"></i></a>
                  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="chatcoversationDropdown">
                    <li><a class="dropdown-item" href="#"><i class="fa-solid fa-video me-2 fw-icon"></i>Video call</a></li>
                    <li><a class="dropdown-item" href="#"><i class="fa-solid fa-phone me-2 fw-icon"></i>Call</a></li>
                    <li><a class="dropdown-item" href="#"><i class="fa-solid fa-trash me-2 fw-icon"></i>Delete </a></li>
                    <li><a class="dropdown-item" href="#"><i class="fa fa-fw fa-star me-2 fw-icon"></i>Mark as important</a></li>
                    <li class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#"><i class="fa fa-ban me-2 fw-icon"></i>Block</a></li>
                  </ul>
                </div>
                <!-- Card action END -->
                <a class="btn btn-secondary-soft-hover py-1 px-2" data-bs-toggle="collapse" href="#collapseChat" aria-expanded="false" aria-controls="collapseChat"><i class="fa fa-minus"></i></a>
                <button class="btn btn-secondary-soft-hover py-1 px-2" data-bs-dismiss="toast" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
              </div>
            </div>
            <!-- Top avatar and status END -->

          </div>
          <div class="toast-body collapse show position-relative" id="collapseChat">
          <div class="spinner-container d-none">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
            <!-- Chat conversation START -->
            <div class="chat-conversation-content custom-scrollbar mb-2 pe-2">
              <div class="os-content" style="padding: 0px; height: 100%; width: 100%;"  id="chat-messages-list-${
                chatRoom._id
              }">
                <!-- Chat time -->
                <div class="text-center small my-2">Jul 16, 2022, 06:15 am</div>
                ${chatRoom.messages
                  .map((chat) => {
                    return `${
                      chat.user !== user._id
                        ? `<!-- Chat message left -->
                <div class="d-flex mb-1">
                  <div class="flex-shrink-0 avatar avatar-xs me-2">
                    <img class="avatar-img rounded-circle" src="${
                      friend.avatar
                        ? friend.avatar
                        : "/images/default-avatar.png"
                    }" alt="">
                  </div>
                  <div class="flex-grow-1">
                    <div class="w-100">
                      <div class="d-flex flex-column align-items-start">
                        <div class="bg-light text-secondary p-2 px-3 rounded-2">${
                          chat.message
                        }</div>
                        <div class="small my-2">${
                          new Date(chat.createdAt)
                            .toLocaleTimeString()
                            .split(":")[0] +
                          ":" +
                          new Date(chat.createdAt)
                            .toLocaleTimeString()
                            .split(":")[1] +
                          " " +
                          new Date(chat.createdAt)
                            .toLocaleTimeString()
                            .split(" ")[1]
                        } </div>
                        
                      </div>
                    </div>
                  </div>
                </div>`
                        : ` <!-- Chat message right -->
                <div class="d-flex justify-content-end text-end mb-1">
                  <div class="w-100">
                    <div class="d-flex flex-column align-items-end">
                      <div class="bg-primary text-white p-2 px-3 rounded-2">${
                        chat.message
                      }</div>
                      <!-- Images -->
                      <div class="d-flex my-2">
                        <div class="small text-secondary">${
                          new Date(chat.createdAt)
                            .toLocaleTimeString()
                            .split(":")[0] +
                          ":" +
                          new Date(chat.createdAt)
                            .toLocaleTimeString()
                            .split(":")[1] +
                          " " +
                          new Date(chat.createdAt)
                            .toLocaleTimeString()
                            .split(" ")[1]
                        } </div>
                        <div class="small ms-2"><i class="fa-solid fa-check"></i></div>
                      </div>
                    </div>
                  </div>
                </div>`
                    }`;
                  })
                  .join("")}
                <!-- Chat Typing 
                <div class="d-flex mb-1">
                  <div class="flex-shrink-0 avatar avatar-xs me-2">
                    <img class="avatar-img rounded-circle" src="${
                      friend.avatar
                        ? friend.avatar
                        : "/images/default-avatar.png"
                    }" alt="">
                  </div>
                  <div class="flex-grow-1">
                    <div class="w-100">
                      <div class="d-flex flex-column align-items-start">
                        <div class="bg-light text-secondary p-3 rounded-2">
                          <div class="typing d-flex align-items-center">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> -->
              </div> 

            </div>
            <!-- Chat conversation END -->
            <!-- Chat bottom START -->
            <div class="">
              <!-- Chat textarea -->
              <textarea class="form-control mb-sm-0 mb-3" id="chat-input-${
                chatRoom._id
              }" placeholder="Type a message" rows="1"></textarea>
              <!-- Button -->

            </div>
            <!-- Chat bottom START -->
          </div>
        </div>
        <!-- Chat toast END -->
      `;
}
function minimize() {
  $(".chatbox").toggleClass("chatbox-min");
}
function hide() {
  $("#chatbox").css("display", "none");

  $(".chatbox").hide();
}
$(".toast-btn").each(function () {
  $(this).click(function () {
    let self = this;
    const friendId = $(this).attr("data-friend-id");
    //if already open then return
    if ($(`#chatToast-${friendId}`).length) {
      var toastTarget = document.getElementById(`chatToast-${friendId}`);
      var toast = new bootstrap.Toast(toastTarget);
      toast.show();
      $(`#chatToast-${friendId}  textarea`).focus();
      tinymce.init({
        selector: `#chatToast-${friendId}  textarea`,
        menubar: false,
        toolbar_location: "bottom",
        plugins: "autoresize link lists emoticons image",
        autoresize_bottom_margin: 0,
        max_height: 100,
        placeholder: "Enter message . . .",
        toolbar:
          "bold italic link bullist emoticons strikethrough | mySendButton",
        setup: function (editor) {
          editor.ui.registry.addButton("mySendButton", {
            tooltip: "Send Message",
            text: "Send",
            onAction: function () {
              let msg = editor.getContent();
              if (msg != "" && msg != "<p></p>") {
                socket.emit("send_message", {
                  message: msg,
                  user: selfUser,
                  user_email: userMail,
                  user_id: selfUser._id,
                  chatroom: currentChatRoom,
                });
                //reload chat
                editor.setContent("");
              }
            },
          });
        },
      });
    } else {
      $.ajax({
        type: "GET",
        url: `/messages/chatroom?friend=${friendId}`,
        success: function (data) {
          let { chatRoom, friend, user } = data.data;
          //remove previous chatbox
          $(".toast-container").empty();
          tinymce.remove();
          let room = createArea(chatRoom, friend, user);
          $(".toast-container").append(room);
          $(".spinner-container").removeClass("d-none");
          setTimeout(() => {
            $(".spinner-container").addClass("d-none");
          }, 1000);
          var toastTarget = document.getElementById(self.dataset.target);
          var toast = new bootstrap.Toast(toastTarget);
          toast.show();

          selfUser = user;
          otherUser = friend;
          currentChatRoom = chatRoom._id;
          userMail = user.email;
          tinymce.init({
            selector: `#chat-input-${currentChatRoom}`,
            menubar: false,
            toolbar_location: "bottom",
            plugins: "autoresize link lists emoticons image",
            autoresize_bottom_margin: 0,
            max_height: 100,
            placeholder: "Enter message . . .",
            toolbar:
              "bold italic link bullist emoticons strikethrough | mySendButton",
            setup: function (editor) {
              editor.ui.registry.addButton("mySendButton", {
                tooltip: "Send Message",
                text: "Send",
                onAction: function () {
                  let msg = editor.getContent();
                  if (msg != "" && msg != "<p></p>") {
                    socket.emit("send_message", {
                      message: msg,
                      user: selfUser,
                      user_email: userMail,
                      user_id: selfUser._id,
                      chatroom: currentChatRoom,
                    });
                    //reload chat
                    editor.setContent("");
                  }
                },
              });
            },
          });

          connectRoom();
          scrollBottom();
          //changeScreen();
          //arrow();
          //tempClass(friendId);
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    }
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
  let list = document.getElementsByClassName("chat-conversation-content")[0];

  //Scroll to the bottom of the messages div
  list.scrollTop = list.scrollHeight;
}

function tempClass(friendId) {
  $("#roomlist > div").removeClass("temporary-highlight");
  $(`#friend-${friendId}`).addClass("temporary-highlight");
}
