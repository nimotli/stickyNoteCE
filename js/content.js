let highlightedElement = null;
const originalHrefs = [];

const highlight = function (event) {
    if(event.target.className !== 'sticky-note-element' && event.target.className !== 'highlighted-element') {
        if (highlightedElement) {
            highlightedElement.style.outline = '';
        }
        event.target.style.outline = '2px solid red';
        highlightedElement = event.target;
    }
}

const postStickyNote = function (event) {
    console.log(`clicked an element ${highlightedElement}`)
    if (highlightedElement) {
        console.log("will add sticky note")
        const note = prompt('Enter your note:');
        if (note) {
            const sticky = document.createElement('div');
            const stickyId = `sticky-note-element-${Date.now()}`
            sticky.textContent = note;
            sticky.className = 'sticky-note-element';
            sticky.style.position = 'absolute';
            sticky.style.background = 'yellow';
            sticky.style.zIndex = '9999';
            document.body.appendChild(sticky);
            sticky.style.left = event.pageX + 'px';
            sticky.style.top = event.pageY + 'px';
            sticky.style.display = 'block'
            sticky.id = stickyId
            event.target.style.backgroundColor = '#e0b926'
            event.target.style.cursor = 'pointer'
            event.target.className = 'highlighted-element'
            event.target.addEventListener('click', function() {
                toggleStickyVisibility(stickyId);
            });
            clearStickyNoteAdding();
        }
    }
    event.preventDefault();
    event.stopPropagation();
}

const toggleStickyVisibility = function (id) {
    console.log(`trying to find element with id ${id}`)
    const element = document.getElementById(id)
    if(element.style.display === 'none')
        element.style.display = 'block'
    else
        element.style.display = 'none'
}

const clearStickyNoteAdding = function (){
    document.removeEventListener('mouseover',highlight)
    document.removeEventListener('click',postStickyNote)
    if (highlightedElement) {
        highlightedElement.style.outline = '';
    }
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
        link.href = originalHrefs[index];
    });
}
const initiateStickyNoteAdding = function(){
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        originalHrefs.push(link.href); // Store original href
        link.removeAttribute('href'); // Disable the link
    });
    document.addEventListener('click', postStickyNote);
    document.addEventListener('mouseover', highlight);
}

chrome.runtime.onMessage.addListener(function(message) {
    if (message === "injectScript") {
        initiateStickyNoteAdding()
    }
})
