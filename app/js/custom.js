var cheerio = require('cheerio')

window.onload = function() {
    var url = "https://api.nytimes.com/svc/movies/v2/reviews/picks.json?api-key=f40c524ffccf4afd86d8b61f3847250a&offset=1",
        webview = document.getElementById('webview'),
        articles = [],
        index = 0

    document.getElementById('prevButton').addEventListener('click', prevArticle, false)
    document.getElementById('nextButton').addEventListener('click', nextArticle, false)

    loadArticles()

    webview.addEventListener('dom-ready', function() {
        // webview.openDevTools()
    })

    webview.addEventListener('did-finish-load', function(e) {
        // Send an event to the injected JavaScript when the page loads
        // This function gets called anytime `webview.src` is changed
        webview.send('host-did-request-summary')
    })

    webview.addEventListener('ipc-message', function(e) {
        if (e.channel == 'summary') {
            document.getElementById('summary').innerHTML = e.args[0]
            document.getElementById('summary').style.visibility = 'visible'
            document.querySelector('.loader-container').style.display = 'none'
        }
    })

    function loadArticles() {
        window.request(url, function(data) {
            data = JSON.parse(data)
            articles = data.results

            loadArticle(articles[0])
        }, function(err) {
            console.error(err)
        })
    }

    function loadArticle(article) {
        document.getElementById('summary').style.visibility = 'hidden'
        document.querySelector('.loader-container').style.display = 'inherit'
        webview.src = article.link.url
        document.getElementById('article-title').textContent = article.display_title
        document.getElementById('rating').textContent = article.mpaa_rating
        document.getElementById('preview').src = article.multimedia.src.replace('mediumThreeByTwo210', 'master768')
        document.getElementById('article-author').textContent = article.byline.toTitleCase()
        document.getElementById('article-name').textContent = article.headline.replace('Review: ', '')
    }

    function prevArticle() {
        index = (index > 0) ? index - 1 : 0
        loadArticle(articles[index])
    }

    function nextArticle() {
        index = (index < articles.length - 1) ? index + 1 : articles.length - 1
        loadArticle(articles[index])
    }
}

String.prototype.toTitleCase = function() {
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

window.request = function(url, callback, error) {
    if (window.fetch) {
        fetch(url).then(function(res) {
            if (res.status != 200) {
                console.error("Bad Request")
                error({
                    "text": res.statusText,
                    "code": res.status
                })
                return
            }
            res.text().then(function(data) {
                callback(data)
            })

        }).catch(function(err) {
            console.error("Fetch Error: " + err)
        })
    } else {
        var xhr = new XMLHttpRequest()
        xhr.onload = function() {
            if (this.status != 200) {
                console.error("Bad Request")
                error({
                    "text": this.statusText,
                    "code": this.status
                })
                return
            }
            callback(this.responseText)
        }
        xhr.onerror = function(err) {
            error(err)
        }
        xhr.open('GET', url)
        xhr.send()
    }
}
