const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const pencilWidthSelection = document.querySelector('.pencil-width-selection')
const penColorBlocks = document.querySelectorAll('.pencil-color')
const eraserWidthSelection = document.querySelector('.eraser-width-selection')
const undoContainer = document.querySelector('.undo-container')
const redoContainer = document.querySelector('.redo-container')

const tool = canvas.getContext('2d')
tool.fillStyle = 'white'
tool.fillRect(0, 0, canvas.width, canvas.height);



let pencilStrokeWidth = "3"
let pencilStrokeColor = "red"
let eraserStrokeWidth = "3"
let eraserStrokeColor = "white"
let undoRedoTracker = []
let tracker = 0

tool.strokeStyle = pencilStrokeColor
tool.lineWidth = pencilStrokeWidth

let mouseDown = false

function beginPath(strokeObj) {
    tool.beginPath()
    tool.moveTo(strokeObj.clientX, strokeObj.clientY)
}

function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color
    tool.lineWidth = strokeObj.width
    tool.lineTo(strokeObj.x, strokeObj.y)
    tool.stroke()
}

canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
    const data = {
        x: e.clientX,
        y: e.clientY
    }
    socket.emit('beginPath', data)
    // beginPath({
    //     x: e.clientX,
    //     y: e.clientY
    // })
})

canvas.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        const data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserSelectionOpen ? eraserStrokeColor : pencilStrokeColor,
            width: eraserSelectionOpen ? eraserStrokeWidth : pencilStrokeWidth
        }
        // drawStroke({
        //     x: e.clientX,
        //     y: e.clientY,
        //     color: eraserSelectionOpen ? eraserStrokeColor : pencilStrokeColor,
        //     width: eraserSelectionOpen ? eraserStrokeWidth : pencilStrokeWidth
        // })
        socket.emit('drawStroke', data)
    }
})

canvas.addEventListener('mouseup', (e) => {
    mouseDown = false
    const url = canvas.toDataURL()
    undoRedoTracker.push(url)
    tracker = undoRedoTracker.length - 1
})

pencilWidthSelection.addEventListener('change', (e) => {
    pencilStrokeWidth = e.target.value
    tool.lineWidth = pencilStrokeWidth
})

penColorBlocks.forEach(colorBlock => {
    colorBlock.addEventListener('click', () => {
        pencilStrokeColor = colorBlock.classList[1]
        tool.strokeStyle = pencilStrokeColor
    })
});

eraserWidthSelection.addEventListener('click', (e) => {
    eraserStrokeWidth = e.target.value;
    tool.lineWidth = eraserStrokeWidth
})

function toogleStrokes() {
    if (eraserSelectionOpen) {
        tool.strokeStyle = eraserStrokeColor;
        tool.lineWidth = eraserStrokeWidth
    } else {
        tool.strokeStyle = pencilStrokeColor
        tool.lineWidth = pencilStrokeWidth
    }
}

eraserIcon.addEventListener('click', (e) => {
    toogleStrokes()
})

pencilIcon.addEventListener('click', () => {
    toogleStrokes()
})


undoContainer.addEventListener('click', () => {
    if (tracker > 0) tracker--;
    const data = {
        undoRedoTracker, tracker
    }
    socket.emit('undoRedo', data)
    // undoRedoImageGenerator(data)
})


redoContainer.addEventListener('click', () => {
    if (tracker < undoRedoTracker.length - 1) tracker++;
    const data = {
        undoRedoTracker, tracker
    }
    socket.emit('undoRedo', data)
    // undoRedoImageGenerator(data)
})

function undoRedoImageGenerator({ undoRedoTracker, tracker }) {
    const image = new Image()
    const url = undoRedoTracker[tracker]
    image.src = url;
    image.onload = () => {
        tool.drawImage(image, 0, 0, canvas.width, canvas.height)
    }
}

socket.on('beginPath', (data) => {
    beginPath(data)
})

socket.on('drawStroke', (data) => {
    drawStroke(data)
})

socket.on('undoRedo', (data) => {
    undoRedoImageGenerator(data)
})