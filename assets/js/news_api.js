function NewsApi() {
  let url =
    "https://newsapi.org/v2/top-headlines?country=in&apiKey=510a27dd6ab14b5188faf8feb46981f5";
  $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    success: function (data) {
      let news = data.articles;
      let newsList = document.getElementById("news-lists");
      let str = "";
      // Take only 5 news
      news = news.slice(0, 7);
      for (let i = 0; i < news.length; i++) {
        str += `<li class="news mb-1">
        <a href="${news[i].url}">${news[i].title} <i class="fa fa-external-link"></i></a>
        </li>`;
      }
      newsList.innerHTML = str;
    },
    error: function (error) {
      console.log(error);
    },
  });
}

NewsApi();
