const optionsContainer = document.querySelector('.options-container')
const toolsContainer = document.querySelector('.tools-container')
const pencilIcon = document.querySelector('.pencil-icon')
const pencilSelection = document.querySelector('.pencil-selection')
const eraserIcon = document.querySelector('.eraser-icon')
const eraserSelection = document.querySelector('.eraser-selection')
const notesBtnContainer = document.querySelector('.notes-btn-container')
const openBoard = document.querySelector('.open-board')
const imageUploadContainer = document.querySelector('.image-upload-container')
const downloadContainer = document.querySelector('.download-container')


let optionsOpen = true
let pencilSelectionOpen = false
let eraserSelectionOpen = false

optionsContainer.addEventListener('click', (e) => {
    const icon = optionsContainer.children[0]
    if (optionsOpen) {
        icon.classList.remove('fa-bars')
        icon.classList.add('fa-times')
        toolsContainer.style.display = "none"
        optionsOpen = false
    } else {
        icon.classList.remove('fa-times')
        icon.classList.add('fa-bars')
        toolsContainer.style.display = "flex"
        optionsOpen = true
    }
})

pencilIcon.addEventListener('click', () => {
    if (pencilSelectionOpen) {
        pencilSelectionOpen = false
        pencilSelection.style.display = "none"
    } else {
        pencilSelectionOpen = true
        pencilSelection.style.display = "flex"
        eraserSelection.style.display = "none"
    }
})

eraserIcon.addEventListener('click', () => {
    if (eraserSelectionOpen) {
        eraserSelection.style.display = "none"
        eraserSelectionOpen = false
    } else {
        eraserSelection.style.display = "flex"
        pencilSelection.style.display = "none"
        eraserSelectionOpen = true
    }
})

function createStickyNote(template) {
    const stickyNote = document.createElement('div')
    stickyNote.setAttribute('class', 'sticky-notes-container')
    stickyNote.setAttribute('draggable', "true")
    stickyNote.setAttribute('id', crypto.randomUUID())
    stickyNote.innerHTML = template

    const minimizeBtn = stickyNote.querySelector('.minimize')
    const closeBtn = stickyNote.querySelector('.close')
    const notesContent = stickyNote.querySelector('.notes-content')


    minimizeBtn.addEventListener('click', () => {
        const display = getComputedStyle(notesContent).display
        if (display === "block") {
            notesContent.style.display = "none"
        } else {
            notesContent.style.display = "block"
        }
    })

    closeBtn.addEventListener('click', () => {
        stickyNote.remove()
    })

    dragElement(stickyNote)

    openBoard.appendChild(stickyNote)
}

notesBtnContainer.addEventListener('click', () => {
    const template =
        `<div class="notes-header">
            <button class="minimize notes-header-btn"></button>
            <button class="close notes-header-btn"></button>
        </div>
        <div class="notes-content">
            <textarea id="text-area"></textarea>
        </div>`
    createStickyNote(template)
    document.getElementById("text-area").addEventListener("mousedown", function (e) {
        e.stopPropagation();
    }, false);
})





imageUploadContainer.addEventListener('click', () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.click()
    input.addEventListener('change', () => {
        const file = input.files[0]
        const url = (window.URL ? URL : webkitURL).createObjectURL(file);
        const template =
            `<div class="notes-header">
                <button class="minimize notes-header-btn"></button>
                <button class="close notes-header-btn"></button>
            </div>
            <div class="notes-content">
                <img src=${url} />
            </div>`
        createStickyNote(template)
    })
})

downloadContainer.addEventListener('click', () => {
    const canvas = document.querySelector('canvas')
    const a = document.createElement('a')
    a.download = "snapshot"
    a.href = canvas.toDataURL()
    a.click()
})

function dragElement(element) {
    let startPosX = 0, startPosY = 0, diffBtwDesAndSrcX = 0, diffBtwDesAndSrcY = 0;

    element.onmousedown = function (e) {
        e.preventDefault();
        startPosX = e.clientX;
        startPosY = e.clientY;

        document.onmousemove = mouseMoved
        document.onmouseup = mouseUp
    }


    function mouseMoved(e) {
        diffBtwDesAndSrcX = e.clientX - startPosX
        diffBtwDesAndSrcY = e.clientY - startPosY
        startPosX = e.clientX;
        startPosY = e.clientY

        element.style.left = element.offsetLeft + diffBtwDesAndSrcX + 'px'
        element.style.top = element.offsetTop + diffBtwDesAndSrcY + 'px'
    }

    function mouseUp() {
        document.onmouseup = null
        document.onmousemove = null
    }


}
