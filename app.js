const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
var server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
const io = require('socket.io')(server)

app.use(express.static('public'))
app.use(express.json())

app.get('/', (req,res) => {
    // res.render('index', { chatItems })
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    console.log('A user has connected');

    socket.on('message sent', (msg) => {
        // console.log('in connection: ' + msg)
        io.sockets.emit('message sent', msg)
    })

    socket.on('disconnect', () => {
        console.log('User has disconnected')
    })
})