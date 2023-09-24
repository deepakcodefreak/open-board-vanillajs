const express = require('express')
const socket = require('socket.io')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('./public'))

const server = app.listen(port, () => {
    console.log('Running on port', port);
})

const io = socket(server)

io.on('connection', (socket) => {
    console.log('New connection')

    socket.on('beginPath', (data) => {
        socket.broadcast.emit('beginPath', data)
    })

    socket.on('drawStroke', (data) => {
        socket.broadcast.emit('drawStroke', data)
    })

    socket.on('undoRedo', (data) => {
        socket.broadcast.emit('undoRedo', data)
    })





})