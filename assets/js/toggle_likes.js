// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    this.toggleLike();
  }

  toggleLike() {
    $(this.toggler).click(function (e) {
      e.preventDefault();
      let self = this;

      // this is a new way of writing ajax which you might've studied, it looks like the same as promises
      $.ajax({
        type: "POST",
        url: $(self).attr("href"),
      })
        .done(function (data) {
          let likesCount = parseInt($(self).attr("data-likes"));
          
          if (data.data.deleted == true) {
            likesCount -= 1;
            $(self).attr("data-likes", likesCount);
            
          } else {
            likesCount += 1;
            $(self).attr("data-likes", likesCount);
          }
          $(self).html(`<button class="like__btn">
                <span id="icon"><i class="fas fa-thumbs-up"></i></span>
                <span id="count">
                    ${likesCount}
                </span> Like
            </button>`);
        })
        .fail(function (errData) {
          console.log("error in completing the request");
        });
    });
  }
}
