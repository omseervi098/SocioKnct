{
  async function NewsApi() {
    $.ajax({
      url: "/get-news",
      type: "GET",
    })
      .done(function (data) {
        let news = data.data.articles;
        let newsList = document.querySelectorAll(".news-list-container");
        let str = "";
        // Take only 5 news
        news = news.slice(0, 5);
        for (let i = 0; i < news.length; i++) {
          str += `<li class="news mb-1">
        <a href="${news[i].url}" target="_blank">${news[i].title} <i class="fa fa-external-link"></i></a>
        </li>`;
        }
        for (let i = 0; i < newsList.length; i++) {
          newsList[i].innerHTML = str;
        }
      })
      .fail(function (err) {
        console.log(err);
      });
  }

  NewsApi();
}
