function getInfo(tag,data) {
  var url = "https://api.nytimes.com/svc/movies/v2/reviews/picks.json";
  url += '?' + $.param({
    'api-key': "f40c524ffccf4afd86d8b61f3847250a",
    'offset': 1
  });
  $.ajax({
    url: url,
    method: 'GET',
  }).done(function(jsonData) {
    if(data == "display_title"){
      document.getElementById(tag).innerHTML = jsonData.results[0].display_title;
    } else if(data == "summary_short") {
      document.getElementById(tag).innerHTML = jsonData.results[0].summary_short;
    } else if(data == "headline") {
      document.getElementById(tag).innerHTML = jsonData.results[0].headline;
    } else if(data == "byline") {
      document.getElementById(tag).innerHTML = jsonData.results[0].byline;
    } else if(data == "link") {
      document.getElementById(tag).innerHTML = jsonData.results[0].link["url"];
      document.getElementById(tag).setAttribute("href",document.getElementById(tag).innerHTML = jsonData.results[0].link["url"]);
    } else if(data == "webview") {
      document.getElementById(tag).setAttribute("src",jsonData.results[0].link["url"]);
    } else if(data == "img") {
      document.getElementById(tag).innerHTML = jsonData.results[0].multimedia["src"];
    } else {
      document.getElementById(tag).innerHTML = "Data Error - JSON lookup tag incorrect!";
    }
  }).fail(function(err){  throw err;  });
}
