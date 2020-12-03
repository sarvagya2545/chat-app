var socket = io.connect('http://localhost:3000')

const btnSend = document.getElementById('btn-send')
const chatInput = document.getElementById('chat-input')
const chatBox = document.getElementById('chat-box')

var name = ""

btnSend.addEventListener('click', e => {
    e.preventDefault()
    const message = chatInput.value
    if(message !== '') {
        var chatMsg = {
            message: message,
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
    msgBox.textContent = chatMsg.message            
    li = document.createElement('li')
    li.className = 'chat-list-item'
    li.appendChild(msgBox)    
    chatBox.appendChild(li)
}