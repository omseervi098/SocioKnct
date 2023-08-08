{
  //method to submit form data for new post using AJAX

  $(document).ready(function () {
    let createPost = function () {
      let postnormalfeed = $("#postnormalfeed");
      postnormalfeed.on("click", function (e) {
        e.preventDefault();
        var content = $("#normalfeedpost > textarea").val();
        var data = new FormData();
        data.append("content", content);
        console.log(content);
        $.ajax({
          url: "/posts/create",
          method: "POST",
          data: {
            content: content,
          },
          success: function (data) {
            console.log(data);
          },
          error: function (error) {
            console.log(error.responseText);
          },
        });
      });
      let postvideofeed = $("#postvideofeed");
      postvideofeed.on("click", function (e) {
        e.preventDefault();
        var content = $("#videofeedpost > textarea").val();
        var video = $("#upload_videofile")[0].files[0];
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
          success: function (data) {
            console.log(data);
          },
          error: function (error) {
            console.log(error.responseText);
          },
        });
      });
      let postphotofeed = $("#postphotofeed");
      let feedActionPhotoModal = $("#feedActionPhoto");
      postphotofeed.on("click", function (e) {
        console.log("clicked");
        e.preventDefault();
        var content = $("#photofeedpost > textarea").val();
        var image = $("#upload_file")[0].files[0];
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
          success: function (data) {
            console.log(data);
            let newPost = newPostDom(data.data.post, data.data.locals, image);
            $("#post-list-container-div").prepend(newPost);
            //close modal
            feedActionPhotoModal.modal("hide");
            // deletePost($(".delete-post-button", newPost));
            // // CHANGE :: enable the functionality of the toggle like button on the new post
            // new ToggleLike($(" .toggle-like-button", newPost));
            //Adding noty notification
            new Noty({
              theme: "relax",
              type: "success",
              layout: "topRight",
              text: "Post Created !!!",
              timeout: 1500,
            }).show();
          },
          error: function (error) {
            console.log(error.responseText);
          },
        });
      });

      // newPostForm.submit((e) => {
      //   if ($("#image").val() == "") {
      //     e.preventDefault();
      //     $.ajax({
      //       url: "/posts/create",
      //       type: "POST",
      //       data: newPostForm.serialize(),
      //       success: function (data) {
      //         let newPost = newPostDom(data.data.post);
      //         $("#post-list-container-div").prepend(newPost);
      //         $("#new-post-form")[0].reset();
      //         deletePost($(".delete-post-button", newPost));
      //         // CHANGE :: enable the functionality of the toggle like button on the new post
      //         new ToggleLike($(" .toggle-like-button", newPost));
      //         //Adding noty notification
      //         new Noty({
      //           theme: "relax",
      //           type: "success",
      //           layout: "topRight",
      //           text: "Post Created !!!",
      //           timeout: 1500,
      //         }).show();
      //       },
      //       error: function (err) {
      //         console.log(err);
      //       },
      //     });
      //   }
      // });
    };
    //method create a post in DOM
    let getImageFromURL = function (url) {
      let img = new Image();
      img.src = url;
      return img;
    };
    let newPostDom = function (post, locals, image) {
      return $(`
  <div id="post-${post._id}>" class="post">
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
                  ${new Date(post.createdAt).toLocaleString()}
                </span>
              </div>
              <p class="mb-0 small updated-time">
                ${new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <!-- Card feed action dropdown START -->
          ${
            locals.user &&
            `<div class="dropdown">
            <a href="#" class="text-secondary btn btn-secondary-soft-hover py-1 px-2" id="cardFeedAction" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fa fa-ellipsis-h text-muted"></i>
            </a>
            <!-- Card feed action dropdown menu -->
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="cardFeedAction">
              ${
                locals.user.id == post.user.id
                  ? `<li>
                <a class="dropdown-item" href="/posts/destroy/${post.id}>">
                  <i class="fa fa-trash fa-fw pe-2"></i>
                  Delete post
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="/posts/destroy/${post.id}>">
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
        ${post.content && `<p class="text-mutednpm">${post.content}</p>`}
        <!-- Card img -->
        <div class="card-image-container position-relative">
          ${
            post.image
              ? `<img class="card-img" src="${post.image}" alt="post image" />
            <div class="viewfullscreen py-1 px-2 pe-3">
            <button class="btn btn-sm btn-secondary-soft" data-bs-toggle="modal" data-bs-target="#modal-fullscreen-${post._id}>">
              <i class="fa-regular fa-eye fa-2x"></i>
            </button>
          </div>`
              : ``
          }
          ${
            post.video
              ? `<video class="card-img" controls disablePictureInPicture controlsList="nodownload">
            <source src="${post.video}>" type="video/mp4" />
          </video>`
              : ``
          } 

          <!-- Modal to view fullscreen -->
          <div class="modal fade" id="modal-fullscreen-${
            post._id
          }>" tabindex="-1" aria-labelledby="modal-fullscreenLabel" aria-hidden="true">
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
            locals.user
              ? `<li class="nav-item">
            <a class="nav-link toggle-like-button" data-likes="${
              post.likes.length
            }" href="/likes/toggle/?id=${post._id}>&type=Post">
              ${
                post.likes.find((like) => {
                  return like.user._id.toString() == locals.user._id.toString();
                })
                  ? `<span class="liked"><i class="fa fa-thumbs-up pe-1"></i>Liked (${post.likes.length})</span>`
                  : `<span><i class="fa fa-thumbs-up pe-1"></i>Like (${post.likes.length})</span>`
              } 
            </a>
          </li>
          <li class="nav-item fw-bold">
            <a class="nav-link" href="#!">
              <i class="fa fa-comment pe-1"></i> Comment (${
                post.comments.length
              })
            </a>
          </li>
          <!-- Card share action START  -->
          <li class="nav-item dropdown ms-sm-auto fw-bold d-none d-sm-block">
            <a class="nav-link mb-0" href="#" id="cardShareAction" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fa fa-share pe-1"></i>Share
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="cardShareAction">
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
          <form class="nav nav-item w-100 position-relative" action="/comments/create" method="POST">
            <input type="text" name="content" id="comment-input" class="form-control rounded-pill bg-transparent border-0" placeholder="Write a comment" />
            <input type="hidden" name="post" value="${post._id}" />
            <button class="nav-link bg-transparent px-3 position-absolute top-50 end-0 translate-middle-y border-0" type="submit" id="add-comment">
              <i class="fa fa-paper-plane"></i>
            </button>
          </form>
        </div>`
            : ``
        }

        <!-- Comment wrap START -->
     
       
        <!-- Comment wrap END -->
      </div>
      <!-- Card body END -->
      ${
        post.comments.length > 1
          ? `<div class="card-footer">
        <p class="mb-0">
          <a class="text-secondary small me-3 fw-bold text-decoration-none" data-bs-toggle="collapse" href="#${
            post._id
          }-comments-all" role="button" aria-expanded="false" aria-controls="collapseExample">Load More Comments (${
              post.comments.length - 1
            })</a>
        </p>
      </div>`
          : ``
      }
    </div>
  </div>
</div>`);
    };
    //method to delete post from dom
    let deletePost = function (deleteLink) {
      $(deleteLink).click(function (e) {
        e.preventDefault();
        $.ajax({
          type: "get",
          url: $(deleteLink).prop("href"),
          success: function (data) {
            $(`#post-${data.data.post_id}`).remove();
            new Noty({
              theme: "relax",
              type: "success",
              layout: "topRight",
              text: "Post deleted !!",
              timeout: 1500,
            }).show();
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
        let deleteButton = $(" .delete-post-button", self);
        deletePost(deleteButton);
        // get the post's id by splitting the id attribute
        let postId = self.prop("id").split("-")[1];
        new PostComments(postId);
      });
    };
    createPost();
    convertPostsToAjax();
  });
}
