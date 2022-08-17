{
  //method to submit form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");
    newPostForm.submit((e) => {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          $("#post-list-container>div").prepend(newPost);
        },
        error: function (err) {
          console.log(err.responseText);
        }
      });
    });
  };
  //method create a post in DOM
  let newPostDom = function (post) {
    return $(`<div id="post-${post._id}" class="post">
        <div class="ithpost">
            <div class="name">
                ${post.user.name}
                <button><a class="delete-post-button" href="/posts/destroy/${ post._id }">Delete</a></button>
            </div>
            <div class="content">
                ${post.content}
            </div>
        </div>
        <div class="post-comments">
            <form action="/comments/create" method="POST">
                <input required type="text" id="comment-input" name="content" placeholder="Type Here to add comment">
                <input type="hidden" name="post" value="${post._id}">
                <input type="submit" id="add-comment" value="Add Comment">
            </form>
            <div class="comment-list" id="post-comments-${post._id}">
            </div>
        </div>
    </div>`)
  }
  createPost();
}
