let highlightedElement = null;
const originalHrefs = [];
let isAddingTicket = false;
let ticketPosition = {x: 0, y: 0};
const injectStarterHTML = function () {
    const modalHTML = `
      <div id="myModal" class="modal">
        <div class="modal-content">
          <p>Note</p>
          <input type="text" id="noteInput" placeholder="Enter your note...">
          <button id="submitButton">Submit</button>
        </div>
      </div>
    `;
    const container = document.createElement('div');
    container.innerHTML = modalHTML;
    document.body.appendChild(container);
}
injectStarterHTML()


const modal = document.getElementById('myModal');
const submitButton = document.getElementById('submitButton');
const submitNote = function () {
    const noteInput = document.getElementById('noteInput');
    const note = noteInput.value;
    // Process the note as needed (e.g., save it, display it, etc.)
    console.log('Note submitted:', note);
    postStickyNote(note)
    closeModal();
}

submitButton.addEventListener('click', submitNote);

// Open the modal
function openModal(event) {
    if(!isAddingTicket) {
        modal.style.display = 'block';
        ticketPosition = {x: event.pageX, y: event.pageY}
        isAddingTicket = true
    }
}

// Close the modal
function closeModal() {
    const noteInput = document.getElementById('noteInput');
    noteInput.value = '';
    modal.style.display = 'none';
    isAddingTicket = false
}

const highlight = function (event) {
    if (event.target.className !== 'sticky-note-element' && event.target.className !== 'highlighted-element' && !isAddingTicket) {
        if (highlightedElement) {
            highlightedElement.style.outline = '';
        }
        event.target.style.outline = '2px solid red';
        highlightedElement = event.target;
    }
}


const postStickyNote = function (note) {
    console.log(`clicked an element ${highlightedElement}`)
    if (highlightedElement) {
        console.log("will add sticky note")
        if (note) {
            const sticky = document.createElement('div');
            const stickyId = `sticky-note-element-${Date.now()}`
            sticky.textContent = note;
            sticky.className = 'sticky-note-element';
            sticky.style.position = 'absolute';
            sticky.style.background = 'yellow';
            sticky.style.zIndex = '9999';
            document.body.appendChild(sticky);
            sticky.style.left = ticketPosition.x + 'px';
            sticky.style.top = ticketPosition.y + 'px';
            sticky.style.display = 'block'
            sticky.id = stickyId
            highlightedElement.style.backgroundColor = '#e0b926'
            highlightedElement.style.cursor = 'pointer'
            highlightedElement.className = 'highlighted-element'
            highlightedElement.addEventListener('click', function () {
                toggleStickyVisibility(stickyId);
            });
            clearStickyNoteAdding();
        }
    }
}

const toggleStickyVisibility = function (id) {
    console.log(`trying to find element with id ${id}`)
    const element = document.getElementById(id)
    if (element.style.display === 'none')
        element.style.display = 'block'
    else
        element.style.display = 'none'
}

const clearStickyNoteAdding = function () {
    document.removeEventListener('mouseover', highlight)
    document.removeEventListener('click', openModal)
    if (highlightedElement) {
        highlightedElement.style.outline = '';
    }
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
        link.href = originalHrefs[index];
    });
}
const initiateStickyNoteAdding = function () {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        originalHrefs.push(link.href); // Store original href
        link.removeAttribute('href'); // Disable the link
    });
    document.addEventListener('click', openModal);
    document.addEventListener('mouseover', highlight);
}

chrome.runtime.onMessage.addListener(function (message) {
    if (message === "injectScript") {
        initiateStickyNoteAdding()
    }
})

window.addEventListener('click', function (event) {
    if (event.target === modal) {
        closeModal();
    }
});
