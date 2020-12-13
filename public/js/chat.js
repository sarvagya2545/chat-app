// Make a connection to the socket from here
// window.location.href returns the main part of the url
var socket = io.connect(window.location.origin)

const params = new URLSearchParams(window.location.search)
const 
    nick = params.get('user'),
    room = params.get('code');

socket.emit('joinRoom', { nick, room })

const btnSend = document.getElementById('btn-send')
const chatInput = document.getElementById('chat-input')
const chatBox = document.getElementById('chat-box')

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

socket.on('message', chatMsg => {
    addMessage(chatMsg);
    // scrolls the chat message box to bottom once any message is recieved
    chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on('enter', alert => {
    addAlert(alert)
})

socket.on('leave', alert => {
    addAlert(alert)
})

const addAlert = (alertMsg) => {
    console.log(alertMsg);
    var alert = document.createElement('div')
    alert.classList.add('alert')
    alert.innerHTML = alertMsg;

    chatBox.appendChild(alert)
}

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