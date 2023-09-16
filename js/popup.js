document.getElementById('startAddStickyNote').addEventListener('click', function() {
    console.log("sending message injectScript")
    // Send the message to the content script of the current tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 'injectScript');
    });
});
