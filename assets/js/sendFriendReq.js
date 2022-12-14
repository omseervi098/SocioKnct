//var socket = io();
var sender = $("#currentuser").val();

var receiverName;

function addFriend(name) {
  $.ajax({
    url: "/add-friend",
    type: "POST",
    data: {
      receiverName: name,
    },
    success: function (data) {
      $("#" + name).toggleClass("requestpen");
      $(".requestpen").html(
        '<i class="fa-solid fa-clock"></i> Request Pending'
      );
    },
    error: function (err) {
      console.log(err);
    },
  });
}

$(document).ready(function () {
  $(".friend-add").on("click", function (e) {
    e.preventDefault();
  });
  $("#accept_friend").on("click", function () {
    //e.preventDefault();
    var senderId = $("#senderId").val();
    var senderName = $("#senderName").val();

    $.ajax({
      url: "/add-friend/",
      type: "POST",
      data: {
        senderId: senderId,
        senderName: senderName,
      },
      success: function (data) {
        //When successfull reload the page
        window.location.reload();
      },
      error: function (err) {
        console.log(err);
      },
    });

    $("#friends-reload").load(location.href + " #friends-reload");
    $("#reload").load(location.href + " #reload");
  });
  $("#cancel_friend").on("click", function (e) {
    e.preventDefault();

    var user_Id = $("#user_Id").val();

    $.ajax({
      url: "/add-friend/",
      type: "POST",
      data: {
        user_Id: user_Id,
      },
      success: function (data) {
        //When successfull reload the page
        //window.location.reload();
      },
      error: function (err) {
        console.log(err);
      },
    });
    $("#reload").load(location.href + " #reload");
  });
});
