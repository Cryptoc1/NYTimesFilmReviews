/*
    This script gets injected into the New York Times website using the preload attribute.
    More info about that here: https://github.com/electron/electron/blob/master/docs/api/web-view-tag.md#preload

    The IPC can be a little confusing at first, but here's the docs link: https://github.com/electron/electron/blob/master/docs/api/ipc-renderer.md

    In short, when the app loads a website into the webview, it calls a function in the electron library that sends an event to the webview.
    that event is handled by this script.
*/

var ipc = require('electron').ipcRenderer

// handle the event the parent sends us
ipc.on('host-did-request-summary', function(e) {
    // Fulfill the request by sending back the DOM
    var sections = document.querySelectorAll('.story-body-text'),
        summary = ''
    for (var i = 0; i < sections.length; i++) {
        summary += sections[i].innerHTML + "<br><br>"
    }
    ipc.sendToHost('summary', summary)
})
