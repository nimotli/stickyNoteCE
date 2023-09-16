document.getElementById('toggleInjection').addEventListener('change', function(event) {
    let message = {
        action: event.target.checked ? "injectScript" : "removeScript"
    };

    // Send the message to the content script of the current tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
});