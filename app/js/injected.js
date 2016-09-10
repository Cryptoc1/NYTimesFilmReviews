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
