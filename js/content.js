let highlightedElement = null;

const highlight = function (event) {
    if (highlightedElement) {
        highlightedElement.style.outline = '';
    }
    event.target.style.outline = '2px solid red';
    highlightedElement = event.target;
}

const postStickyNote = function (event) {
    if (highlightedElement) {
        const note = prompt('Enter your note:');
        if (note) {
            const sticky = document.createElement('div');
            sticky.textContent = note;
            sticky.style.position = 'absolute';
            sticky.style.background = 'yellow';
            sticky.style.zIndex = '9999';
            document.body.appendChild(sticky);
            sticky.style.left = event.pageX + 'px';
            sticky.style.top = event.pageY + 'px';
            // Here you can save the note, position, and associated element to chrome.storage for persistence
        }
    }
    event.preventDefault();
    event.stopPropagation();
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "injectScript") {
        document.addEventListener('click', postStickyNote);
        document.addEventListener('mouseover', highlight);
    }
    else if (message.action === "removeScript") {
        document.removeEventListener('mouseover',highlight)
        document.removeEventListener('click',postStickyNote)
        if (highlightedElement) {
            highlightedElement.style.outline = '';
        }
    }
})
