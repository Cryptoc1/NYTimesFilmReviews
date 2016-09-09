var index = 0;

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
      document.getElementById(tag).innerHTML = jsonData.results[index].display_title;
    } else if(data == "summary_short") {
      document.getElementById(tag).innerHTML = jsonData.results[index].summary_short;
    } else if(data == "headline") {
      document.getElementById(tag).innerHTML = jsonData.results[index].headline;
    } else if(data == "byline") {
      document.getElementById(tag).innerHTML = jsonData.results[index].byline;
    } else if(data == "link") {
      document.getElementById(tag).innerHTML = jsonData.results[index].link["url"];
      //document.getElementById(tag).setAttribute("href",document.getElementById(tag).innerHTML = jsonData.results[index].link["url"]);
    } else if(data == "webview") {
      document.getElementById(tag).setAttribute("src",jsonData.results[index].link["url"]);
    } else if(data == "img") {
      document.getElementById(tag).innerHTML = jsonData.results[index].multimedia["src"];
    } else {
      document.getElementById(tag).innerHTML = "Data Error - JSON lookup tag incorrect!";
    }
  }).fail(function(err){throw err;});
}

function refresh() {
  getInfo("title","display_title");
  getInfo("article","headline");
  getInfo("author","byline");
  getInfo("summary","summary_short");
  getInfo("link","link");
  getInfo("webview","webview");
}

function addIndex() {
  index = index + 1;
  console.log(index);
}

function subtractIndex() {
  if(index == 0) {
    index = 0;
    console.log(index);
  } else {
    index = index - 1;
    console.log(index);
  }
}