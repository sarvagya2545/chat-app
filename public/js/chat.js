var socket = io.connect('https://enigmatic-tundra-59197.herokuapp.com/')
// var socket = io.connect('http://localhost:3000/')

const btnSend = document.getElementById('btn-send')
const chatInput = document.getElementById('chat-input')
const chatBox = document.getElementById('chat-box')

var name = ""

btnSend.addEventListener('click', e => {
    e.preventDefault()
    const message = chatInput.value
    if(message !== '') {
        var date = new Date()
        var chatMsg = {
            message: message,
            date: date,
            id: socket.id
        }
        socket.emit('message sent', chatMsg)
        chatInput.value = ""
    }
})

socket.on('message sent', chatMsg => {
    addMessage(chatMsg);
});

const addMessage = (chatMsg) => {
    var msgBox = document.createElement('div')
    msgBox.classList.add('chat-message')
    if(chatMsg.id == socket.id) {
        msgBox.classList.add('mine')
    } else {
        msgBox.classList.add('others')
    }
    msgBox.innerHTML = 
    `${chatMsg.message}
        <span class="chat-message-time">
            Sent: ${formatAMPM(chatMsg.date)}
        </span>
    `

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