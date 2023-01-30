const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express()
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const io = socketIO(server)
app.use(cors())

const users = [{}]

io.on('connection', (socket) => {
    socket.on('joined', ({ user }) => {
        users[socket.id] = user
        socket.emit('welcome', { user: 'Admin', message: `${users[socket.id]} Welcome to the Chatbox` })
        socket.broadcast.emit('userJoined', { user: 'Admin', message: `${users[socket.id]} has joined` })
    })

    socket.on('message', ({ message, id }) => {
        io.emit('sendMessage', { user: users[id], message, id })
    })

    socket.on('disconnected', () => {
        console.log('user left')
        // users[socket.id] = user
        socket.broadcast.emit('leave', { user: 'Admin', message: `${users[socket.id]} has left the chat` })
    })
})

//api links

app.get('/', (req, res) => {
    res.send("It's working bro")
})


server.listen(port, (req, res) => {
    console.log('running on port 3001')
})