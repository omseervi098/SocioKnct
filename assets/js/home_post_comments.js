// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments {
  // constructor is used to initialize the instance of the class whenever a new instance is created
  constructor(postId) {
    this.postId = postId;
    this.postContainer = $(`#post-${postId}`);
    this.newCommentForm = $(`#post-${postId}-comments-form`);
    this.firstCommentContainer = $(`#${postId}-first-comment`);
    this.remCommentContainer = $(`#${postId}-comments-all`);
    this.createComment(postId);

    let self = this;
    // call for all the existing comments
    $(".delete-comment-btn", this.postContainer).each(function () {
      self.deleteComment($(this));
    });
  }

  createComment(postId) {
    let pSelf = this;
    this.newCommentForm.submit(function (e) {
      e.preventDefault();
      let self = this;
      if (
        pSelf.newCommentForm[0][0].value == "" ||
        !pSelf.newCommentForm[0][0].value.trim()
      ) {
        new Noty({
          theme: "relax",
          text: "Comment cannot be empty",
          type: "error",
          layout: "topRight",
          timeout: 1500,
        }).show();
        return;
      }
      $.ajax({
        type: "post",
        url: "/comments/create",
        data: $(self).serialize(),
        success: function (data) {
          let newComment = pSelf.getCommentDom(
            data.data.comment,
            data.data.post,
            data.data.locals
          );
          if (data.data.post.comments.length == 1) {
            pSelf.firstCommentContainer.prepend(newComment);
          } else if (data.data.post.comments.length > 1) {
            let temp = pSelf.firstCommentContainer[0].firstElementChild;
            pSelf.remCommentContainer.prepend(temp);
            pSelf.firstCommentContainer.html(newComment);
            //loop throught remaining comment and make delete button work
            $(".delete-comment-btn", pSelf.postContainer).each(function () {
              pSelf.deleteComment($(this));
            });
            $(`.card-footer-${postId}`).removeClass("d-none");
            $(`.card-footer-${postId} > p > a`).html(
              `Load More Comments (${data.data.post.comments.length - 1})`
            );
          }
          pSelf.newCommentForm[0].reset();
          pSelf.deleteComment($(`#delete-${data.data.comment._id}-comment`));
          // CHANGE :: enable the functionality of the toggle like button on the new comment

          new Noty({
            theme: "relax",
            text: "Comment published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }
  getCommentDom(comment, post, locals) {
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
                        locals.user && locals.user.id == comment.user.id
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
                            <i class="fa fa-thumbs-up fa-fw me-1"></i>
                            Liked (${comment.likes.length})
                          </span>`
                        : ` <span>
                              <i class="fa fa-thumbs-up fa-fw me-1"></i>
                              Like (${comment.likes.length})
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
                  <span class="ms-1 badge bg-secondary rounded-pill p-auto">
                    <span class="d-none d-lg-inline-block">Replies</span>
                    ${comment.replies.length}
                  </span>
                </div>`
                  : `<div class="text-secondary fw-bold small me-3">
                      <i class="fa fa-thumbs-up fa-fw me-1"></i>
                      Likes (${comment.likes.length})
                    </div>
                    <a class="text-secondary small me-3" href="/login">
                      Replies (${comment.replies.length})
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
                  <form class="nav nav-item w-100 position-relative" action="/comments/create-reply" method="POST" id="comment-${comment._id}-reply-form">
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
           
      </li>
      <!-- Comment item END -->
      `;
  }

  deleteComment(deleteLink) {
    let self = this;
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
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
              $(".delete-comment-btn", self.postContainer).each(function () {
                self.deleteComment($(this));
              });
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
                self.deleteComment($(this));
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
          new Noty({
            theme: "relax",
            text: "Comment Deleted !!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }
}
