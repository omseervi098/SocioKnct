{
  //method to submit form data for new post using AJAX

  $(document).ready(function () {
    socket.on("new_post", function (data) {
      console.log("new post received", data);
      //add event listener to refresh button
      let user = $("#local-user-data").attr("data-user");
      user = JSON.parse(user);
      console.log(user);
      let locals = {
        user: user,
      };
      let newPost = newPostDom(data.post, locals, null);
      $("#post-list-container-div").prepend(newPost);
      deletePost($(`#delete-${data.post._id}-post`, newPost));
      new ToggleLike($(" .toggle-like-button", newPost));
      PostComments(data.post._id);
      //remove refresh button
    });
    socket.on("delete_post", function (data) {
      console.log("delete post received", data);
      $(`#post-${data}`).remove();
    });
    socket.on("toggle_like", function (data) {
      console.log("toggle like received", data);
      let likesCount = data.likes_count;
      let url = data.url;
      //get elemnt by matching url
      let self = $(`a[href="${url}"]`);
      let span = self.children("span");
      let txt = span.text().trim().split(" ")[0];
      span.html(`<i class="fa fa-thumbs-up pe-1"></i>${txt} (${likesCount})`);

      self.attr("data-likes", likesCount);
    });
    socket.on("new_comment", function (data) {
      console.log("create comment received", data);
      let user = $("#local-user-data").attr("data-user");
      user = JSON.parse(user);
      console.log(user);
      let locals = {
        user: user,
      };
      let newComment = getCommentDm(data.comment, data.post, locals);
      let firstCommentContainer = $(`#${data.post._id}-first-comment`);
      let remCommentContainer = $(`#${data.post._id}-comments-all`);
      let postContainer = $(`#post-${data.post._id}`);
      let commentcnt = $(`#commentcnt-${data.post._id}`);
      let postId = data.post._id;
      if (data.post.comments.length == 1) {
        firstCommentContainer.prepend(newComment);
        new ToggleLike($(".toggle-like-button", firstCommentContainer));
        replyPostComment(postId, data.comment._id);
      } else if (data.post.comments.length > 1) {
        let temp = firstCommentContainer[0].firstElementChild;
        remCommentContainer.prepend(temp);
        firstCommentContainer.html(newComment);
        // CHANGE :: enable the functionality of the toggle like button on the new comment
        $(".toggle-like-button", firstCommentContainer).each(function () {
          new ToggleLike($(this));
        });
        replyPostComment(postId, data.comment._id);
        $(`.card-footer-${postId}`).removeClass("d-none");
        $(`.card-footer-${postId} > p > a`).html(
          `Load More Comments (${data.post.comments.length - 1})`
        );
      }
      commentcnt.html(
        `<i class="fa fa-comment pe-1"></i> Comment (${data.post.comments.length})`
      );
    });
    socket.on("delete_comment", function (data) {
      console.log("delete comment received", data);
      let self = {
        firstCommentContainer: $(`#${data.data.postId}-first-comment`),
        remCommentContainer: $(`#${data.data.postId}-comments-all`),
        postContainer: $(`#post-${data.data.postId}`),
        commentcnt: $(`#commentcnt-${data.data.postId}`),
        postId: data.data.postId,
      };
      if (data.data.commentlen == 1) {
        $(`#comment-${data.data.comment_id}`).remove();
      } else if (data.data.commentlen == 2) {
        if (
          self.firstCommentContainer.find(`#comment-${data.data.comment_id}`)
            .length > 0
        ) {
          $(`#comment-${data.data.comment_id}`).remove();
          let temp = self.remCommentContainer.html();
          //remove the first comment from the remaining comments container
          self.remCommentContainer.html("");
          self.firstCommentContainer.html(temp);
          let commentId =
            self.firstCommentContainer[0].firstElementChild.id.split("-")[1];
          replyPostComment(self.postId, commentId);
          $(".delete-comment-btn", self.postContainer).each(function () {
            deleteCommenthome($(this, self.postContainer), self);
          });
          $(".toggle-like-button", self.firstCommentContainer).each(
            function () {
              new ToggleLike($(this));
            }
          );
          $(`.card-footer-${data.data.postId} > p > a`).html(
            `Load More Comments (${data.data.commentlen - 2})`
          );
          $(`.card-footer-${data.data.postId}`).addClass("d-none");
        } else {
          self.remCommentContainer.html("");
          $(`.card-footer-${data.data.postId}`).addClass("d-none");
        }
      } else if (data.data.commentlen > 2) {
        if (
          self.firstCommentContainer.find(`#comment-${data.data.comment_id}`)
            .length > 0
        ) {
          $(`#comment-${data.data.comment_id}`).remove();
          //pick first comment from remaining comments container
          $(".delete-comment-btn", self.postContainer).each(function () {
            deleteCommenthome($(this, self.postContainer), self);
          });
          let temp = self.remCommentContainer[0].firstElementChild;
          //remove the first comment from the remaining comments container
          self.remCommentContainer[0].firstElementChild.remove();
          //add the first comment to the first comment container
          self.firstCommentContainer.html(temp);

          //update the load more comments button
          $(`.card-footer-${data.data.postId} > p > a`).html(
            `Load More Comments (${data.data.commentlen - 2})`
          );
        } else {
          $(`#comment-${data.data.comment_id}`).remove();
          $(`.card-footer-${data.data.postId} > p > a`).html(
            `Load More Comments (${data.data.commentlen - 2})`
          );
        }
      }
      self.commentcnt.html(
        `<i class="fa fa-comment pe-1"></i> Comment (${
          data.data.commentlen - 1
        })`
      );
    });
    socket.on("new_reply", function (data) {
      console.log("create reply received", data);
      let user = $("#local-user-data").attr("data-user");
      user = JSON.parse(user);
      console.log(user);
      let locals = {
        user: user,
      };
      let replyList = $(
        `#comment-${data.data.commentId}-${data.data.postId}-reply-list`
      );
      let replycnt = $(`#replycnt-${data.data.commentId}`);
      let newReply = getReplyDm(data.data.reply, data.data.comment, locals);
      replyList.prepend(newReply);
      new ToggleLike($(`#reply-${data.data.reply._id} .toggle-like-button`));
      console.log($(`#reply-${data.data.reply._id} .toggle-like-button`));
      deleteReplyhome(
        $(`#delete-${data.data.reply._id}-reply`),
        { replycnt: replycnt, replylen: data.data.replylen },
        data.data.commentId
      );
      replycnt.html(` <span class="d-none d-lg-inline-block">Replies</span>
                    ${data.data.comment.replies.length}`);
    });
    socket.on("delete_reply", function (data) {
      console.log("delete reply received", data);
      let replycnt = $(`#replycnt-${data.data.commentId}`);
      $(`#reply-${data.data.reply_id}`).remove();
      replycnt.html(` <span class="d-none d-lg-inline-block">Replies</span>
                    ${data.data.replylen - 1}`);
    });

    let createPost = function () {
      let postnormalfeed = $("#postnormalfeed");
      let feedNormalModal = $("#modalCreateFeed");
      postnormalfeed.on("click", function (e) {
        e.preventDefault();
        var content = $("#normalfeedpost > textarea").val();
        if (!content) {
          new Notification("Please write something first !!!", "warning");
          return;
        }
        var data = new FormData();
        data.append("content", content);
        // unbind click event'
        console.log("clicked");
        postnormalfeed.attr("disabled", true);
        //remove d-none class from loader-container
        $(".lds-ellipsis").removeClass("d-none");
        $.ajax({
          url: "/posts/create",
          method: "POST",
          data: {
            content: content,
          },
        })
          .done(function (data) {
            console.log(data);
            let newPost = newPostDom(data.data.post, data.data.locals, null);
            $("#post-list-container-div").prepend(newPost); //close modal
            feedNormalModal.modal("hide");
            $("#normalfeedpost > textarea").val(""); //clear textarea
            deletePost($(`#delete-${data.data.post._id}-post`, newPost));
            new ToggleLike($(` .toggle-like-button`, newPost)); //toogle like btn on new post
            PostComments(data.data.post._id); //comment dom
            new Notification("Post Created !!!", "success");
            socket.emit("new_post", {
              post: data.data.post,
              type: "normal",
            }); //emit post to all users
            postnormalfeed.attr("disabled", false);
            $(".lds-ellipsis").addClass("d-none");
          })
          .fail(function (error) {
            console.log(error.responseText);
            new Notification("Error in creating post !!!", "error");
            postnormalfeed.attr("disabled", false);
            $(".lds-ellipsis").addClass("d-none");
          });
      });
      let postvideofeed = $("#postvideofeed");
      let feedActionVideoModal = $("#feedActionVideo");
      postvideofeed.on("click", function (e) {
        e.preventDefault();
        var content = $("#videofeedpost > textarea").val();
        var video = $("#upload_videofile")[0].files[0];
        if (!video && !content) {
          new Notification(
            "Please write something or select a video first !!!",
            "warning"
          );
          return;
        }
        if (!video) {
          new Notification("Please select a video first !!!", "warning");
          return;
        }
        postvideofeed.attr("disabled", true);
        $(".lds-ellipsis").removeClass("d-none");
        console.log(video);
        var data = new FormData();
        data.append("video", video);
        data.append("content", content);
        console.log(video, content);
        $.ajax({
          url: "/posts/create/?video=true",
          method: "POST",
          cache: false,
          contentType: false,
          processData: false,
          data: data,
        })
          .done(function (data) {
            console.log(data);
            let newPost = newPostDom(data.data.post, data.data.locals, video);
            $("#post-list-container-div").prepend(newPost);
            feedActionVideoModal.modal("hide");
            $("#videofeedpost > textarea").val("");
            $(".file_remove1").trigger("click");
            deletePost($(`#delete-${data.data.post._id}-post`, newPost));
            new ToggleLike($(" .toggle-like-button", newPost));
            PostComments(data.data.post._id);
            new Notification("Post Created !!!", "success");
            socket.emit("new_post", {
              post: data.data.post,
              type: "video",
            });
            postvideofeed.attr("disabled", false);
            $(".lds-ellipsis").addClass("d-none");
          })
          .fail(function (error) {
            console.log(error.responseText);
            new Notification("Error in creating post !!!", "error");
            postvideofeed.attr("disabled", false);
            $(".lds-ellipsis").addClass("d-none");
          });
      });
      let postphotofeed = $("#postphotofeed");
      let feedActionPhotoModal = $("#feedActionPhoto");
      postphotofeed.on("click", function (e) {
        console.log("clicked");
        e.preventDefault();
        var content = $("#photofeedpost > textarea").val();
        var image = $("#upload_file")[0].files[0];
        if (!image && !content) {
          new Notification(
            "Please write something or select an image first !!!",
            "warning"
          );
          return;
        }
        if (!image) {
          new Notification("Please select an image first !!!", "warning");
          return;
        }
        postphotofeed.attr("disabled", true);
        $(".lds-ellipsis").removeClass("d-none");
        var data = new FormData();
        data.append("image", image);
        data.append("content", content);
        console.log(data);
        $.ajax({
          url: "/posts/create/?image=true",
          method: "POST",
          cache: false,
          contentType: false,
          processData: false,
          data: data,
        })
          .done(function (data) {
            console.log(data);
            let newPost = newPostDom(data.data.post, data.data.locals, image);
            $("#post-list-container-div").prepend(newPost); //close modal
            feedActionPhotoModal.modal("hide"); //clear textarea
            $("#photofeedpost > textarea").val(""); //clear file input
            $(".file_remove").trigger("click");
            deletePost($(`#delete-${data.data.post._id}-post`, newPost));
            new ToggleLike($(" .toggle-like-button", newPost)); //toogle like btn on new post
            PostComments(data.data.post._id); //comment dom
            new Notification("Post Created !!!", "success"); //Adding noty notification
            socket.emit("new_post", {
              post: data.data.post,
              type: "image",
            }); //emit post to all users
            postphotofeed.attr("disabled", false);
            $(".lds-ellipsis").addClass("d-none");
          })
          .fail(function (error) {
            console.log(error.responseText);
            new Notification("Error in creating post !!!", "error");
            postphotofeed.attr("disabled", false);
            $(".lds-ellipsis").addClass("d-none");
          });
      });
      let postaudiofeed = $("#postaudiofeed");
      let feedActionAudioModal = $("#feedActionAudio");
      postaudiofeed.on("click", function (e) {
        e.preventDefault();
        var content = $("#audiofeedpost > textarea").val();
        var audio = $("#upload_audiofile")[0].files[0];
        if (!audio && !content) {
          new Notification(
            "Please write something or select a audio first !!!",
            "warning"
          );
          return;
        }
        if (!audio) {
          new Notification("Please select a audio first !!!", "warning");
          return;
        }
        postaudiofeed.attr("disabled", true);
        $(".lds-ellipsis").removeClass("d-none");
        var data = new FormData();
        data.append("audio", audio);
        data.append("content", content);
        console.log(audio, content);
        $.ajax({
          url: "/posts/create/?audio=true",
          method: "POST",
          cache: false,
          contentType: false,
          processData: false,
          data: data,
        })
          .done(function (data) {
            console.log(data);
            let newPost = newPostDom(data.data.post, data.data.locals, audio);
            $("#post-list-container-div").prepend(newPost);
            feedActionAudioModal.modal("hide");
            $("#audiofeedpost > textarea").val("");
            $(".file_remove2").trigger("click");
            deletePost($(`#delete-${data.data.post._id}-post`, newPost));
            new ToggleLike($(" .toggle-like-button", newPost));
            PostComments(data.data.post._id);
            new Notification("Post Created !!!", "success");
            socket.emit("new_post", {
              post: data.data.post,
              type: "audio",
            });
            postaudiofeed.attr("disabled", false);
            $(".lds-ellipsis").addClass("d-none");
          })
          .fail(function (error) {
            console.log(error.responseText);
            new Notification("Error in creating post !!!", "error");
            postaudiofeed.attr("disabled", false);
            $(".lds-ellipsis").addClass("d-none");
          });
      });
      let postpollfeed = $("#postpollfeed");
      let feedActionPollModal = $("#feedActionPoll");
      postpollfeed.on("click", function (e) {
        console.log("clicked");
        e.preventDefault();
        var formData = $("#pollfeedpost").serialize();
        postpollfeed.attr("disabled", true);
        $(".lds-ellipsis").removeClass("d-none");
        $.ajax({
          url: "/posts/create/?poll=true",
          method: "POST",
          data: formData,
        })
          .done(function (data) {
            let newPost = newPostDom(data.data.post, data.data.locals, null);
            $("#post-list-container-div").prepend(newPost);
            feedActionPollModal.modal("hide");
            deletePost($(`#delete-${data.data.post._id}-post`, newPost));
            new ToggleLike($(" .toggle-like-button", newPost));
            PostComments(data.data.post._id);
            new Notification("Post Created !!!", "success");
            //emit post to all users
            socket.emit("new_post", {
              post: data.data.post,
              type: "poll",
            });
            postpollfeed.attr("disabled", false);
            $(".lds-ellipsis").addClass("d-none");
          })
          .fail(function (error) {
            console.log(error.responseText);
            new Notification("Error in creating post !!!", "error");
            postpollfeed.attr("disabled", false);
            $(".lds-ellipsis").addClass("d-none");
          });
      });
    };

    let newPostDom = function (post, locals, image) {
      console.log(post, locals, image);
      return $(`
        <div id="post-${post._id}" class="post">
        <div class="ithpost">
          <div class="card">
            <!-- Card header START -->
            <div class="card-header border-0 py-2 px-2">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <!-- Avatar -->
                  <div class="avatar avatar-story me-2">
                    <a href="#!">
                      <img class="avatar-img rounded-circle" src="${
                        post.user.avatar
                          ? post.user.avatar
                          : assetPath("images/default-avatar.png")
                      }" alt="avatar" />
                    </a>
                  </div>
                  <!-- Info -->
                  <div>
                    <div class="nav nav-divider">
                      <h6 class="nav-item card-title mb-0">
                        <a href="#!"> ${post.user.name} </a>
                      </h6>
                      <span class="nav-item small ps-1 ps-sm-2 time-posted">
                        ${getTimePosted(post.createdAt)}
                      </span>
                    </div>
                    <p class="mb-0 small updated-time">
                      ${getTimeInString(post.createdAt)}
                    </p>
                  </div>
                </div>
                <!-- Card feed action dropdown START -->
                ${
                  locals.user &&
                  `<div class="dropdown">
                  <a href="#" class="text-secondary btn btn-secondary-soft-hover py-1 px-2" id="cardFeedAction-${
                    post._id
                  }" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa fa-ellipsis-h text-muted"></i>
                  </a>
                  <!-- Card feed action dropdown menu -->
                  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="cardFeedAction-${
                    post._id
                  }">
                    ${
                      locals.user._id == post.user._id
                        ? `<li>
                      <a class="dropdown-item" href="/posts/destroy/${post._id}" id="delete-${post._id}-post">
                        <i class="fa fa-trash fa-fw pe-2"></i>
                        Delete post
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="/posts/destroy/${post._id}">
                        <i class="fa fa-edit fa-fw pe-2"></i>
                        Edit post
                      </a>
                    </li>
                    <li class="d-sm-none">
                      <a class="dropdown-item" href="#">
                        <i class="fa fa-bookmark fa-fw pe-2"></i>Save post</a>
                    </li>
                    <li class="d-sm-none">
                      <a class="dropdown-item" href="#">
                        <i class="fa fa-copy fa-fw pe-2"></i>Copy link</a>
                    </li>`
                        : `<li>
                      <a class="dropdown-item" href="#">
                        <i class="fa fa-user fa-fw pe-2"></i>
                        Unfollow
                        <strong class="text-capitalize">
                          ${post.user.name}
                        </strong>
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">
                        <i class="fa fa-flag fa-fw pe-2"></i>
                        Report post</a>
                    </li>`
                    }
                  </ul>
                </div>`
                } 
                <!-- Card feed action dropdown END -->
              </div>
            </div>
            <!-- Card header END -->
            <!-- Card body START -->
            <div class="card-body pb-0  p-1 p-sm-3">
            ${
              post.poll
                ? `
            <div class="wrapperforpoll" id="wrapperforpoll-${post._id}">
                <h5>${post.poll.question}</h5>
                <div class="poll-area" id="poll-area-${post._id}">
                ${
                  locals.user
                    ? `<div>
                      ${post.poll.options
                        .map((option, i) => {
                          return getPollInputDom(post, locals, option, i);
                        })
                        .join("")}${
                        post.poll.votedBy.includes(locals.user._id)
                          ? post.poll.options
                              .map((option, i) => {
                                return getPollLabelDom(locals, post, true, i);
                              })
                              .join("")
                          : post.poll.options
                              .map((option, i) => {
                                return getPollLabelDom(locals, post, false, i);
                              })
                              .join("")
                      }
                        </div>`
                    : ``
                }
                </div>
              </div>
            `
                : ``
            }
              ${
                post.content
                  ? `
              <div class="post-content mb-3">
                <i class="fa fa-quote-left  text-muted "></i>
              <p class="text-mutednpm d-inline">${post.content}</p>
                  <i class="fa fa-quote-right text-muted "></i>
              </div>`
                  : ``
              }
              <!-- Card img -->
              <div class="${
                post.audio ? `card-audio-container` : `card-image-container`
              } position-relative">
                ${
                  post.image
                    ? `<img class="card-img" src="${post.image}" alt="post image" />
                  <div class="viewfullscreen py-1 px-2 pe-3">
                  <button class="btn btn-sm btn-secondary-soft" data-bs-toggle="modal" data-bs-target="#modal-fullscreen-${post._id}">
                    <i class="fa-regular fa-eye fa-2x"></i>
                  </button>
                </div>`
                    : ``
                }
                ${
                  post.video
                    ? `<video class="card-img" controls disablePictureInPicture controlsList="nodownload">
                  <source src="${post.video}" />
                </video>`
                    : ``
                } 
                ${
                  post.audio
                    ? `<audio class="card-img" controls disablePictureInPicture controlsList="nodownload" src="${post.audio}">
                </audio>`
                    : ``
                }

                <!-- Modal to view fullscreen -->
                <div class="modal fade" id="modal-fullscreen-${
                  post._id
                }" tabindex="-1" aria-labelledby="modal-fullscreenLabel" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class=" modal-content">
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">

                      </button>

                      ${
                        post.image
                          ? `<img class="img-fluid rounded" src="${post.image}" alt="post image" />`
                          : ``
                      }
                        ${
                          post.video
                            ? `<video class="card-img" controls disablePictureInPicture controlsList="nodownload">
                              <source src="${post.video}" type="video/mp4" />
                          </video>`
                            : ``
                        }
                    </div>
                  </div>
                </div>

              </div>
              <!-- Feed react START -->
              <ul class="nav nav-stack pt-2 pb-0 small">
                ${
                  locals.user != null
                    ? `<li class="nav-item">
                  <a class="nav-link toggle-like-button" data-likes="${
                    post.likes.length
                  }" href="/likes/toggle/?id=${post._id}&type=Post">
                    ${
                      post.likes.find((like) => {
                        return (
                          like.user._id.toString() == locals.user._id.toString()
                        );
                      })
                        ? `<span class="liked"><i class="fa fa-thumbs-up pe-1"></i>Liked (${post.likes.length})</span>`
                        : `<span><i class="fa fa-thumbs-up pe-1"></i>Like (${post.likes.length})</span>`
                    } 
                  </a>
                </li>
                <li class="nav-item fw-bold">
                  <a class="nav-link" href="#!" id="commentcnt-${post._id}">
                    <i class="fa fa-comment pe-1"></i> Comment (${
                      post.comments.length
                    })
                  </a>
                </li>
                <!-- Card share action START  -->
                <li class="nav-item dropdown ms-sm-auto fw-bold d-none d-sm-block">
                  <a class="nav-link mb-0" href="#" id="cardShareAction1-${
                    post._id
                  }" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa fa-share pe-1"></i>Share
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="cardShareAction1-${
                    post._id
                  }">
                    <li>
                      <a class="dropdown-item" href="#">
                        <i class="fa fa-bookmark fa-fw pe-2"></i>Save post</a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">
                        <i class="fa fa-copy fa-fw pe-2"></i>Copy link</a>
                    </li>
                  </ul>
                </li>`
                    : `<li class="nav-item">
                  <div class="nav-link" href="/">
                    <i class="fa fa-thumbs-up pe-1"></i> Likes (${post.likes.length}
                    )
                  </div>
                </li>
                <li class="nav-item">
                  <div class="nav-link">
                    <i class="fa fa-comment pe-1"></i> Comment (${post.comments.length})
                  </div>
                </li>`
                }

              </ul>
              <hr>

              <!-- Feed react END -->
              ${
                locals.user
                  ? `<div class="d-flex mb-3">
                <!-- Add comment -->
                <!-- Avatar -->
                <div class="avatar avatar-xs me-2">
                  <a href="#!">
                    <img class="avatar-img rounded-circle" src="${locals.user.avatar}" alt="avatar" />
                  </a>
                </div>
                <!-- Comment box  -->
                <form class="nav nav-item w-100 position-relative" action="/comments/create" method="POST" id="post-${post._id}-comments-form">
                  <input type="text" name="content" id="comment-input-${post._id}" class="form-control rounded-pill bg-transparent border-0 comment-input" placeholder="Write a comment" />
                  <input type="hidden" name="post" value="${post._id}" />
                  <button class="nav-link bg-transparent px-3 position-absolute top-50 end-0 translate-middle-y border-0" type="submit" id="add-comment-${post._id}">
                    <i class="fa fa-paper-plane"></i>
                  </button>
                </form>
              </div>`
                  : ``
              }

              <!-- Comment wrap START -->
            
                <ul class="pt-1 pb-0 m-0 list-unstyled">
                  <div id="${post._id}-first-comment">
                  ${
                    post.comments.length == 1
                      ? getCommentDom(post.comments[0], post, locals)
                      : ``
                  }
                  </div>
                  <div class="collapse" id="${post._id}-comments-all">
                  
                    ${
                      post.comments.length > 1
                        ? forEach(post.comments.slice(1), function (comment) {
                            return getCommentDm(comment, post, locals);
                          })
                        : ``
                    }
                  </div>
                </ul>
            
              <!-- Comment wrap END -->
            </div>
            <!-- Card body END -->
              ${
                post.comments.length > 1
                  ? `
                <div class="card-footer card-footer-${post._id}">
                  <p class="mb-0">
                    <a class="text-secondary small me-3 fw-bold text-decoration-none" data-bs-toggle="collapse" href="#${
                      post._id
                    }-comments-all" role="button" aria-expanded="false" aria-controls="collapseExample">Load More Comments (${
                      post.comments.length - 1
                    })</a>
                  </p>
                </div>
            `
                  : ` 
              <div class="card-footer d-none card-footer-${post._id}">
                <p class="mb-0">
                  <a class="text-secondary small me-3 fw-bold text-decoration-none" data-bs-toggle="collapse" href="#${
                    post._id
                  }-comments-all" role="button" aria-expanded="false" aria-controls="collapseExample">Load More Comments (${
                      post.comments.length - 1
                    })</a>
                </p>
              </div>`
              }
          </div>
        </div>
      </div>`);
    };

    let getPollInputDom = function (post, locals, option, i) {
      return `<input type="checkbox" name="poll" id="opt-${
        i + 1
      }" onclick="pollclick('${i + 1}','${post._id}','${option._id}','${
        post.poll._id
      }','${locals.user._id}')" 
        />`;
    };
    let getPollLabelDom = function (locals, post, flag, i) {
      return `<label for="opt-${i + 1}" class="opt-${i + 1} ${
        flag === true
          ? `selectall ${
              post.poll.options[i].votes.includes(locals.user._id)
                ? ` selected`
                : ``
            }`
          : ``
      } ">
          <div class="row1">
            <div class="column">
              <span class="circle"></span>
              <span class="text">${post.poll.options[i].text}</span>
            </div>
            <span class="percent" id="percent-${post.poll.options[i]._id}">${
        post.poll.options[i].percentage
      }%</span>
          </div>
          <div class="progress" id="progress-${
            post.poll.options[i]._id
          }" style='--w:${post.poll.options[i].percentage}'></div>
        </label>`;
    };
    let deleteCommenthome = function (deleteLink, pSelf) {
      let self = pSelf;
      $(deleteLink).click(function (e) {
        e.preventDefault();

        $.ajax({
          type: "GET",
          url: $(deleteLink).prop("href"),
          success: function (data) {
            if (data.data.commentlen == 1) {
              $(`#comment-${data.data.comment_id}`).remove();
            } else if (data.data.commentlen == 2) {
              if (
                self.firstCommentContainer.find(
                  `#comment-${data.data.comment_id}`
                ).length > 0
              ) {
                $(`#comment-${data.data.comment_id}`).remove();
                let temp = self.remCommentContainer.html();
                //remove the first comment from the remaining comments container
                self.remCommentContainer.html("");
                self.firstCommentContainer.html(temp);
                let commentId =
                  self.firstCommentContainer[0].firstElementChild.id.split(
                    "-"
                  )[1];
                replyPostComment(self.postId, commentId);
                $(".delete-comment-btn", self.postContainer).each(function () {
                  deleteComment($(this, self.postContainer));
                });
                $(".toggle-like-button", self.firstCommentContainer).each(
                  function () {
                    new ToggleLike($(this));
                  }
                );
                $(`.card-footer-${data.data.postId} > p > a`).html(
                  `Load More Comments (${data.data.commentlen - 2})`
                );
                $(`.card-footer-${data.data.postId}`).addClass("d-none");
              } else {
                self.remCommentContainer.html("");
                $(`.card-footer-${data.data.postId}`).addClass("d-none");
              }
            } else if (data.data.commentlen > 2) {
              if (
                self.firstCommentContainer.find(
                  `#comment-${data.data.comment_id}`
                ).length > 0
              ) {
                $(`#comment-${data.data.comment_id}`).remove();
                //pick first comment from remaining comments container
                $(".delete-comment-btn", self.postContainer).each(function () {
                  deleteComment($(this, self.postContainer));
                });
                let temp = self.remCommentContainer[0].firstElementChild;
                //remove the first comment from the remaining comments container
                self.remCommentContainer[0].firstElementChild.remove();
                //add the first comment to the first comment container
                self.firstCommentContainer.html(temp);

                //update the load more comments button
                $(`.card-footer-${data.data.postId} > p > a`).html(
                  `Load More Comments (${data.data.commentlen - 2})`
                );
              } else {
                $(`#comment-${data.data.comment_id}`).remove();
                $(`.card-footer-${data.data.postId} > p > a`).html(
                  `Load More Comments (${data.data.commentlen - 2})`
                );
              }
            }
            pSelf.commentcnt.html(
              `<i class="fa fa-comment pe-1"></i> Comment (${
                data.data.commentlen - 1
              })`
            );
            new Notification("Comment deleted !!!", "success");
            socket.emit("delete_comment", {
              data: {
                comment_id: data.data.comment_id,
                comment: data.data.comment,
                post: data.data.post,
                commentlen: data.data.commentlen,
                postId: data.data.postId,
              },
            });
          },
          error: function (error) {
            console.log(error.responseText);
            new Notification("Error in deleting comment !!!", "danger");
          },
        });
      });
    };
    let deleteReplyhome = function (deleteLink, pSelf, CommentId) {
      $(deleteLink).click(function (e) {
        e.preventDefault();
        $.ajax({
          type: "GET",
          url: $(deleteLink).prop("href"),
        })
          .done(function (data) {
            $(`#reply-${data.data.reply_id}`).remove();
            pSelf
              .replycnt.html(` <span class="d-none d-lg-inline-block">Replies</span>
                    ${data.data.replylen - 1}`);
            new Notification("Reply deleted", "success");
            socket.emit("delete_reply", {
              data: {
                reply_id: data.data.reply_id,
                replylen: data.data.replylen,
                commentId: CommentId,
              },
            });
          })
          .fail(function (errData) {
            new Notification("Error in deleting reply", "danger");
            console.log("error in completing the request", errData);
          });
      });
    };
    let getCommentDm = function (comment, post, locals) {
      return `
      <!-- Comment item START -->
      <li class="comment-item mb-3" id="comment-${comment._id}">
        <div class="d-flex ithcomment">
          <!-- Avatar -->
          <div class="avatar avatar-xs">
            <a href="#!">
              <img class="avatar-img rounded-circle" src="${
                comment.user.avatar
                  ? comment.user.avatar
                  : assetPath("images/default-avatar.png")
              }" alt="${comment.user.name}" />
            </a>
          </div>
          <!-- Comment by -->
          <div class="ms-2 w-100">
            <div class="bg-light p-3 rounded">
              <div class="d-flex flex-column">
                <div class="d-flex align-items-center w-100">
                  <h6 class="mb-1 card-title d-flex flex-wrap gap-1 align-items-center justify-content-between flex-grow-1">
                    <a href="#!"> ${comment.user.name} </a>
                    <div class="text-muted  small ps-0  time-posted">
                      ${getTimePosted(comment.createdAt)}
                    </div>
                  </h6>
                  <div class="dropdown ms-1">
                    <a href="#" class="text-secondary btn btn-secondary-soft-hover py-1 px-2 commentAction" id="commentAction-${
                      comment._id
                    }" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fa fa-ellipsis-h text-muted"></i>
                    </a>
                    <!-- Card feed action dropdown menu -->
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="commentAction-${
                      comment._id
                    }">
                      ${
                        locals.user && locals.user._id == comment.user._id
                          ? `<li>
                        <a class="dropdown-item" href="/comments/destroy/${comment._id}">
                          <i class="fa fa-edit fa-fw pe-2"></i>
                          Edit Comment
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item delete-comment-btn" href="/comments/destroy/${comment._id}" id="delete-${comment._id}-comment">
                          <i class="fa fa-trash fa-fw pe-2"></i>
                          Delete Comment
                        </a>
                      </li>`
                          : locals.user
                          ? `<li>
                        <a class="dropdown-item" href="#">
                          <i class="fa fa-user fa-fw pe-2"></i>
                          Unfollow
                          <strong class="text-capitalize">
                            ${comment.user.name}
                          </strong>
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="#">
                          <i class="fa fa-flag fa-fw pe-2"></i>
                          Report Comment</a>
                      </li>`
                          : ``
                      }
                    </ul>
                  </div>
                </div>
                <p class="small mb-0">${comment.content}</p>
              </div>
            </div>
            <div class="d-flex align-items-center mt-1 share">
              ${
                locals.user
                  ? `
                <a href="/likes/toggle/?id=${
                  comment._id
                }&type=Comment" class="text-secondary small me-3 toggle-like-button" data-likes="${
                      comment.likes.length
                    }">
                    ${
                      comment.likes.find((like) => {
                        return (
                          like.user._id.toString() == locals.user._id.toString()
                        );
                      })
                        ? `<span class="liked">
                            <i class="fa fa-thumbs-up fa-fw me-1"></i>Liked (${comment.likes.length})
                          </span>`
                        : ` <span>
                              <i class="fa fa-thumbs-up fa-fw me-1"></i>Like (${comment.likes.length})
                            </span>`
                    }
                </a>
                <a class="text-secondary small me-2 d-flex align-items-center" data-bs-toggle="collapse" href="#${
                  comment._id
                }-reply" role=" button" aria-expanded="false" aria-controls="collapseExample">
                  <i class="fa fa-comment fa-fw me-1"></i>
                  Reply
                </a>
                <div>
                  <span class="ms-1 badge bg-secondary rounded-pill p-auto" id="replycnt-${
                    comment._id
                  }">
                    <span class="d-none d-lg-inline-block">Replies</span>
                    ${comment.replies.length}
                  </span>
                </div>`
                  : `<div class="text-secondary fw-bold small me-3">
                      <i class="fa fa-thumbs-up fa-fw me-1"></i>Likes (${comment.likes.length})
                    </div>
                    <a class="text-secondary small me-3" href="/login">Replies (${comment.replies.length})
                    </a>`
              }
            </div>
          </div>
        </div>

        ${
          locals.user
            ? `<!-- Add comment -->
              <div id="${comment._id}-reply" class="collapse ms-5">
                <div class="d-flex mt-2 mb-2">
                  <!-- Avatar -->
                  <div class="avatar avatar-xs me-2">
                    <a href="#!">
                      <img class="avatar-img rounded-circle" src="${locals.user.avatar}" alt="avatar" />
                    </a>
                  </div>
                  <!-- Comment box  -->
                  <form class="nav nav-item w-100 position-relative" action="/comments/create-reply" method="POST" id="comment-${comment._id}-${post._id}-reply-form">
                    <input type="text" name="content" id="reply-input-${comment._id}"
                    class="form-control rounded-pill bg-transparent border-0 reply-input" placeholder="Write a comment " />
                    <input type="hidden" name="post" value="${post._id}" />
                    <input type="hidden" name="comment" value="${comment._id}" />
                    <button class="nav-link bg-transparent px-3 position-absolute top-50 end-0 translate-middle-y border-0 add-reply" type="submit" id="add-reply-${comment._id}">
                      <i class="fa fa-paper-plane"></i>
                    </button>
                  </form>
                </div>
              </div>`
            : ``
        } 
        <ul class="pt-2 pb-0 list-unstyled ms-5" id="comment-${comment._id}-${
        post._id
      }-reply-list">
          
        </ul>
      </li>
      <!-- Comment item END -->
      `;
    };
    let getReplyDm = function (reply, comment, locals) {
      return `
      <!-- Reply item START -->
      <li class="reply-item mb-2" id="reply-${reply._id}">
        <div class="d-flex ithreply">
          <!-- Avatar -->
          <div class="avatar avatar-xs">
            <a href="#!">
              <img class="avatar-img rounded-circle" src="${
                reply.user.avatar
                  ? reply.user.avatar
                  : assetPath("images/default-avatar.png")
              }" alt="${reply.user.name}" />
            </a>
          </div>
          <!-- Reply by -->
          <div class="ms-2 w-100">
            <div class="bg-light pe-2 pe-sm-3 p-3 rounded">
              <div class="d-flex flex-column">
                <div class="d-flex align-items-center w-100 justify-content-between">

                  <h6 class="mb-1 card-title d-flex flex-wrap gap-1 align-items-center justify-content-between flex-grow-1">
                    <a href="#!"> ${reply.user.name} </a>
                    <div class="text-muted  small ps-0  time-posted">
                      ${getTimePosted(reply.createdAt)}
                    </div>
                  </h6>

                  <div class="dropdown ms-1">
                    <a href="#" class="text-secondary btn btn-secondary-soft-hover py-1 px-2" id="replyAction" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fa fa-ellipsis-h text-muted"></i>
                    </a>
                    <!-- Card feed action dropdown menu -->
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="replyAction">
                      ${
                        locals.user && locals.user._id == reply.user._id
                          ? `<li>
                        <a class="dropdown-item" href="/post/destroy-reply/${reply._id}">
                          <i class="fa fa-edit fa-fw pe-2"></i>
                          Edit Reply
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item delete-reply-btn" href="/comments/destroy-reply/${reply._id}" id="delete-${reply._id}-reply">
                          <i class="fa fa-trash fa-fw pe-2"></i>
                          Delete Reply
                        </a>
                      </li>`
                          : locals.user
                          ? `
                      <li>
                        <a class="dropdown-item" href="#">
                          <i class="fa fa-user fa-fw pe-2"></i>
                          Unfollow
                          <strong class="text-capitalize">
                            ${reply.user.name}
                          </strong>
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="#">
                          <i class="fa fa-flag fa-fw pe-2"></i>
                          Report Reply</a>
                      </li> `
                          : ``
                      } 
                    </ul>
                  </div>
                </div>
                <p class="small mb-0">${reply.content}</p>
                <!-- Like Button -->
              </div>
            </div>
            <div class="share">
              ${
                locals.user
                  ? `<a href="/likes/toggle/?id=${
                      reply._id
                    }&type=CommentReply" data-likes="${
                      reply.likes.length
                    }" class="text-muted small toggle-like-button">
                ${
                  reply.likes.find((like) => {
                    return (
                      like.user._id.toString() == locals.user._id.toString()
                    );
                  })
                    ? `
                      <span class="liked">
                        <i class="fa fa-thumbs-up fa-fw pe-2"></i>Liked (${reply.likes.length})
                      </span>`
                    : `<span><i class="fa fa-thumbs-up fa-fw pe-2"></i>Like (${reply.likes.length})</span>`
                } 
              </a>`
                  : `<div class="text-muted small fw-bold">
                <i class="fa fa-thumbs-up fa-fw pe-2"></i>Likes (${reply.likes.length})
              </div>`
              }
            </div>
          </div>
        </div>
      </li>
      `;
    };
    //method to delete post from dom
    let deletePost = function (deleteLink, post_id) {
      $(deleteLink).click(function (e) {
        e.preventDefault();
        $.ajax({
          type: "get",
          url: $(deleteLink).prop("href"),
          success: function (data) {
            console.log(data.data);
            $(`#post-${data.data.post_id}`).remove();
            new Notification("Post Deleted !!!", "success");
            socket.emit("delete_post", data.data.post_id);
          },
          error: function (err) {
            console.log(err.responseText);
          },
        });
      });
    };
    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function () {
      $("#post-list-container > div > .post").each(function () {
        let self = $(this);
        // get the post's id by splitting the id attribute
        let postId = self.prop("id").split("-")[1];
        let deleteButton = $(`#delete-${postId}-post`, self);
        deletePost(deleteButton, postId);
        PostComments(postId);
      });
    };
    createPost();
    convertPostsToAjax();
  });
}
