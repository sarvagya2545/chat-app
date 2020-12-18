// Make a connection to the socket from here
// window.location.href returns the main part of the url
var socket = io.connect(window.location.origin)

const params = new URLSearchParams(window.location.search)
const 
    nick = params.get('user'),
    room = params.get('code');

// User emits joinRoom to show that he entered the chat
socket.emit('joinRoom', { nick, room })

var typing = false;
var timeout = undefined;

// DOM elements
const btnSend = document.getElementById('btn-send')
const chatInput = document.getElementById('chat-input')
const chatBox = document.getElementById('chat-box')
const userList = document.getElementById('people-list')
const typingBox = document.getElementById('typing-status')

// Keys which match
const keys = [
    "Space",
    "Backspace",
    "Minus",
    "Equal",
    "BracketLeft",
    "BracketRight",
    "Backslash",
    "Semicolon",
    "Quote",
    "Comma",
    "Period",
    "Slash",
    "Backquote"
];

// Show "user is typing..." message to all other users in the chat.
chatInput.addEventListener('keydown', e => {
    if(isTyping(e)) {
        typing = true
        socket.emit('typing', { nick, room, typing: true })
        clearTimeout(timeout)
        timeout = setTimeout(typingTimeout, 500)
    } else if (e.key == "Enter") {
        clearTimeout(timeout)
        typingTimeout()
    }
})

// checks if the keys being pressed are considered to be the keys which are typing
const isTyping = e => {
    return (e.code.substring(0,5) === "Digit") || e.code.substring(0,3) === "Key" || keys.includes(e.code);
}

const typingTimeout = () => {
    typing = false;
    socket.emit('typing', { nick, room, typing })
}

// send chat message on click
btnSend.addEventListener('click', e => {
    e.preventDefault()
    const message = chatInput.value
    if(message !== '') {
        var date = new Date()
        var chatMsg = {
            message: message,
            date: date,
            id: socket.id,
            room,
            nick
        }
        socket.emit('message', chatMsg)
        chatInput.value = ""
    }
})

// listener for chat message events
socket.on('message', chatMsg => {
    addMessage(chatMsg);
    // scrolls the chat message box to bottom once any message is recieved
    chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on('display', data => {
    if(data.typing === true) {
        typingBox.innerText = `${data.nick} is typing...`
        typingBox.style.display = 'block'
    } else {
        typingBox.style.display = 'none'
    }
})

// updates users list inside the dom
socket.on('roomUsers', data => {
    userList.innerHTML = ''
    data.users.forEach(user => {
        addUserToList(user);
    })
})

// Updating user list whenever user enters/leaves
const addUserToList = (user) => {
    const userNameHTML = `
        <li class="person">
            <img src="/images/avatar.jpg" alt="avatar">
            ${ user.nick }
        </li>
    `
    userList.innerHTML += userNameHTML;
}

// Message add whenever user enters / leaves
socket.on('enter', user => {
    addAlert(`${user.nick} has entered the chat`)
})

socket.on('leave', removedUser => {
    addAlert(`${removedUser.nick} has left the chat`)
})

// inserts message to the dom
const addAlert = (alertMsg) => {
    console.log(alertMsg);
    var alert = document.createElement('div')
    alert.classList.add('alert')
    alert.innerHTML = alertMsg;

    chatBox.appendChild(alert)
}

// add the message to the html dom
const addMessage = (chatMsg) => {
    var msgBox = document.createElement('div')
    msgBox.classList.add('chat-message')
    if(chatMsg.id == socket.id) {
        msgBox.classList.add('mine')
        msgBox.innerHTML = 
        `${chatMsg.message}
            <span class="chat-message-time">
                Sent: ${formatAMPM(chatMsg.date)}
            </span>
        `
    } else {
        msgBox.classList.add('others')
        msgBox.innerHTML = 
        `<span class="msg-owner-name msg-${chatMsg.color}">${chatMsg.nick}</span>
        ${chatMsg.message}
            <span class="chat-message-time">
                Sent: ${formatAMPM(chatMsg.date)}
            </span>
        `
    }

    li = document.createElement('li')
    li.className = 'chat-list-item'
    li.appendChild(msgBox)    
    console.log(li)
    chatBox.appendChild(li)
}

// formatting date to the required format
function formatAMPM(date) {
    date = new Date(date)
    console.log(date)
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}