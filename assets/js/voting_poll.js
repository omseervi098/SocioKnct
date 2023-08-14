function updatePoll(data) {
  let optionIdx = data.optionIdx;
  let postId = data.postId;
  let userId = data.userId;
  let optionId = data.optionId;
  let pollId = data.pollId;
  let poll = data.poll;
  console.log(optionId);
  let wrapperforpolllabel = $(`#wrapperforpoll-${postId} label`);
  for (let i = 0; i < wrapperforpolllabel.length; i++) {
    wrapperforpolllabel[i].innerHTML = `
    <div class="row1">
    <div class="column">
        <span class="circle"></span>
        <span class="text">${poll.options[i].text}</span>
    </div>
    <span class="percent" id="percent-${optionId}">${poll.options[i].percentage}%</span>
    </div>
    <div class="progress" id="progress-${optionId}" style='--w:${poll.options[i].percentage}'></div>
      `;
  }
}
function pollclick(optionIdx, postId, optionId, pollId, userId) {
  var data = {
    optionIdx: optionIdx,
    postId: postId,
    optionId: optionId,
    pollId: pollId,
    userId: userId,
  };
  $.ajax({
    type: "POST",
    url: "/polls/vote",
    data: data,
  })
    .done(function (data) {
      if (data.message == "You have already voted") {
        new Notification("You have already voted", "warning");
      } else {
        const poll = data.data.poll;
        console.log(poll);
        let wrapperforpolllabel = $(`#wrapperforpoll-${postId} label`);
        let wrapperforpollinput = $(`#wrapperforpoll-${postId} input`);
        for (let i = 0; i < wrapperforpolllabel.length; i++) {
          wrapperforpolllabel[i].outerHTML = `<label for="opt-${
            i + 1
          }" class="opt-${i + 1}> selectall ${
            poll.options[i].votes.includes(userId) ? `selected` : ``
          } ">
                        <div class="row1">
                        <div class="column">
                            <span class="circle"></span>
                            <span class="text">${poll.options[i].text}</span>
                        </div>
                        <span class="percent" id="percent-${optionId}">${
            poll.options[i].percentage
          }%</span>
                        </div>
                        <div class="progress" id="progress-${optionId}" style='--w:${
            poll.options[i].percentage
          }'></div>
                    </label>`;
        }
        socket.emit("vote", {
          optionIdx: optionIdx,
          postId: postId,
          optionId: optionId,
          pollId: pollId,
          userId: userId,
          poll: data.data.poll,
        });
      }
    })
    .fail(function (errData) {
      console.log("error in completing the request", errData);
    });
}
socket.on("vote", function (data) {
  const poll = data.poll;
  console.log("vote received", data);
  updatePoll(data);
});
