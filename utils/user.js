// mimics a database for users in this chat application
let users = []

function addUser(id, nick, room) {
    const user = { id, nick, room }
    users.push(user)
    console.log(users);
    return user;
}

function removeUser(id) {
    removedUser = findUserById(id);
    users = users.filter(user => {
        return user.id !== id;
    })
    console.log(users);
    return removedUser;
}

function findUserById(id) {
    const foundUserIndex = users.findIndex((user) => {
        return user.id === id;
    })

    console.log(users);
    if(foundUserIndex === -1) {
        return { err: 'No such user exists' }
    } else {
        return users[foundUserIndex]
    }
}

function findUsersByNick(nick) {
    return users.filter(user => user.nick === nick)
}

function getUsersByRoom(room) {
    return users.filter(user => user.room === room)
}

function getUsersList() {
    return users;
}

module.exports = {
    addUser,
    getUsersByRoom,
    getUsersList,
    removeUser,
    findUserById,
    findUsersByNick
}