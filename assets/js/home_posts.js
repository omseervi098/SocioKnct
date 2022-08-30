{
  //method to submit form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");
    newPostForm.submit((e) => {
      if ($("#image").val() == "") {
        e.preventDefault();
        $.ajax({
          url: "/posts/create",
          type: "POST",
          data: newPostForm.serialize(),
          success: function (data) {
            let newPost = newPostDom(data.data.post);
            $("#post-list-container-div").prepend(newPost);
            $("#new-post-form")[0].reset();
            deletePost($(".delete-post-button", newPost));
            // CHANGE :: enable the functionality of the toggle like button on the new post
            new ToggleLike($(" .toggle-like-button", newPost));
            //Adding noty notification
            new Noty({
              theme: "relax",
              type: "success",
              layout: "topRight",
              text: "Post Created !!!",
              timeout: 1500,
            }).show();
          },
          error: function (err) {
            console.log(err);
          },
        });
      }
    });
  };
  //method create a post in DOM
  let newPostDom = function (post) {
    return $(`<div id="post-${post._id}" class="post">
        <div class="ithpost">
        <div class="name">
            <span>
            ${post.user.avatar?
              `<img src="${post.user.avatar}" >`:
              `<img src="/images/default-avatar.png">`}
            ${post.user.name}</span>
            <div>
              <div class="dropdown">
                <button class="dropbtn"><i class="fa-solid fa-circle-chevron-down"></i></button>
                <div class="dropdown-content">
                    <a class="delete-post-button" href="/posts/destroy/${post._id}">Delete</a>
                </div>
              </div>  
            </div>
        </div>
            <div class="content">
                ${post.content}
            </div>
            <small>
                <a class="toggle-like-button " data-likes="0"
                    href="/likes/toggle/?id=${post._id}&type=Post">
                    <button class="like__btn">
                        <span id="icon"><i class="far fa-thumbs-up"></i></span>
                        <span id="count">
                            0
                        </span> Like
                    </button>
                </a>
            </small>
        </div>
        <div class="post-comments">
            <form action="/comments/create" method="POST" id="post-${post._id}-comments-form">
                <input required type="text" id="comment-input" name="content" placeholder="Type Here to add comment">
                <input type="hidden" name="post" value="${post._id}">
                <input type="submit" id="add-comment" value="Add Comment">
            </form>
            <div class="post-comments-list" >
                <div id="post-comments-${post._id}">
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
}
