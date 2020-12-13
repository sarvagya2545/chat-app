const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
var server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
const io = require('socket.io')(server)
const {
    addUser, removeUser, getUserNickColor
} = require('./utils/user')

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.get('/', (req,res) => {
    res.render('index');
})

app.post('/chat', (req,res) => {
    const { code, nick } = req.body;
    if(!code) {
        res.redirect('/chat/public/?user=' + nick)      
    } else {
        if(!nick) {
            // handle no nick error
        }
        res.redirect('/chat/?code=' + code + '&user=' + nick)
    }
})

app.get('/chat', (req,res) => {
    const { code, user: nick } = req.query;
    res.render('chat', { code: code, nick: nick })
})

app.get('/chat/public', (req,res) => {
    res.send('Public room')
})

// socket connection code
io.on('connection', (socket) => {
    console.log('A user has connected');

    socket.on('joinRoom', ({ nick, room }) => {
        const user = addUser(socket.id, nick, room);
        socket.join(user.room);
        socket.to(room).emit('enter', `${user.nick} has joined the chat`)
    })

    socket.on('message', (msg) => {
        console.log(msg)
        msg = { ...msg, color: getUserNickColor(msg.id) }
        console.log(msg)
        io.to(msg.room).sockets.emit('message', msg)
    })

    socket.on('disconnect', () => {
        const removedUser = removeUser(socket.id);
        io.to(removedUser.room).sockets.emit('leave', `${removedUser.nick} has left the chat`)
        console.log('User has disconnected')
    })
})