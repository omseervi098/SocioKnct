function replyPostComment(PostId, CommentId) {
  let pSelf = {
    PostId: PostId,
    CommentId: CommentId,
    newReplyForm: $(`#comment-${CommentId}-${PostId}-reply-form`),
    replyList: $(`#comment-${CommentId}-${PostId}-reply-list`),
    commentContainer: $(`#comment-${CommentId}`),
  };
  let createReply = function () {
    pSelf.newReplyForm.submit(function (e) {
      e.preventDefault();
      let self = this;
      if (
        pSelf.newReplyForm[0][0].value == "" ||
        !pSelf.newReplyForm[0][0].value.trim()
      ) {
        new Notification("Reply cannot be empty", "warning");
        return;
      }
      $.ajax({
        type: "POST",
        url: "/comments/create-reply",
        data: $(self).serialize(),
      })
        .done(function (data) {
          let newReply = getReplyDom(
            data.data.reply,
            data.data.comment,
            data.data.locals
          );
          pSelf.replyList.prepend(newReply);
          new ToggleLike($(".toggle-like-button", newReply));
          deleteReply($(`#delete-${data.data.reply._id}-reply`));
          new Notification("Reply created", "success");
          self.reset();
        })
        .fail(function (errData) {
          new Notification("Error in creating reply", "danger");
          console.log("error in completing the request", errData);
        });
    });
  };
  let convertReplyToAjax = function () {
    $(`.delete-reply-btn`, self.commentContainer).each(function () {
      deleteReply($(this));
    });
  };
  let deleteReply = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "GET",
        url: $(deleteLink).prop("href"),
      })
        .done(function (data) {
          $(`#reply-${data.data.reply_id}`).remove();
          new Notification("Reply deleted", "success");
        })
        .fail(function (errData) {
          new Notification("Error in deleting reply", "danger");
          console.log("error in completing the request", errData);
        });
    });
  };
  let getReplyDom = function (reply, comment, locals) {
    return `
      <!-- Reply item START -->
      <li class="comment-item mb-2" id="reply-${reply._id}">
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
                        locals.user && locals.user.id == reply.user.id
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
                            ${comment.user.name}
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
                    ? `<span class="liked">
                  <i class="fa fa-thumbs-up fa-fw pe-2"></i>Liked (${reply.likes.length})</span>`
                    : `<span><i class="fa fa-thumbs-up fa-fw pe-2"></i>Like (${reply.likes.length})</span>`
                } 
              </a>`
                  : `<div class="text-muted small fw-bold">
                <i class="fa fa-thumbs-up fa-fw pe-2"></i> Likes (${reply.likes.length})
              </div>`
              }
            </div>
          </div>
        </div>
      </li>
      `;
  };
  createReply(PostId, CommentId);
  convertReplyToAjax();
}
