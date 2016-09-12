// I prefer to put the script inside `window.onload` (I feel that it's safer because the DOM Tree should be loaded and anything the browser needs to do should be done)
window.onload = function() {
    // Globals
    var url = "https://api.nytimes.com/svc/movies/v2/reviews/picks.json?api-key=f40c524ffccf4afd86d8b61f3847250a&offset=1",
        webview = document.getElementById('webview'),
        articles = [],
        index = 0

    // Setup functions to handle click events on out buttons
    document.getElementById('prevButton').addEventListener('click', prevArticle, false)
    document.getElementById('nextButton').addEventListener('click', nextArticle, false)

    webview.addEventListener('did-finish-load', function(e) {
        // Send an event to the injected JavaScript when the page loads
        // This function gets called anytime `webview.src` is changed
        webview.send('host-did-request-summary')
    })

    webview.addEventListener('ipc-message', function(e) {
        // Receive our summary
        if (e.channel == 'summary') {
            // Set our summary text
            document.getElementById('summary').innerHTML = e.args[0]

            // Stop the loading animation
            document.getElementById('summary').style.visibility = 'visible'
            document.querySelector('.loader-container').style.display = 'none'
        }
    })

    function loadArticles() {
        /*
            TODO:
            Using the `offset` argument in the NYT API, modify this function to handle the offset.
            This way, in `nextArticle`, if we reach the end of the `articles` array, we can load more
            reviews from the API.
        */

        // Get the articles from the NYT API, and load the first one.
        window.request(url, function(data) {
            data = JSON.parse(data)
            articles = data.results
            loadArticle(articles[0])
        }, function(err) {
            // TODO: Display an error in the app that the API couldn't be reached.
            document.getElementsByTagName('article')[0].style.display = 'none'
            document.getElementsByTagName('error')[0].style.display = 'block'
            console.error(err)
        })
    }

    function loadArticle(article) {
        // Start the loading animation
        document.getElementById('summary').style.visibility = 'hidden'
        document.querySelector('.loader-container').style.display = 'inherit'

        // Setting the `src` will chain fire all of the events to stop the loading animation and load the full summary
        webview.src = article.link.url

        // We get all this stuff from the NYT API
        document.getElementById('article-title').textContent = article.display_title
        document.getElementById('rating').textContent = article.mpaa_rating

        // The API only has a small picture, so we change a part of the file name to get the larger image
        document.getElementById('preview').src = article.multimedia.src.replace('mediumThreeByTwo210', 'master768')
        document.getElementById('article-author').textContent = article.byline.toTitleCase()

        // We don't need 'Review: ' in the title, since we already know it's going to be a review
        document.getElementById('article-name').textContent = article.headline.replace('Review: ', '')
    }

    function prevArticle() {
        // Inline conditional to check bounds of the array
        index = (index > 0) ? index - 1 : 0
        loadArticle(articles[index])
    }

    function nextArticle() {
        // Inline conditional to check bounds of the array
        index = (index < articles.length - 1) ? index + 1 : articles.length - 1
        loadArticle(articles[index])
    }

    // Initialize everything, and load the first review
    loadArticles()
}




// Helpers

String.prototype.toTitleCase = function() {
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

window.request = function(url, callback, error) {
    // This is my version of an XHR wrapper, because fetch is supposed to be better
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
