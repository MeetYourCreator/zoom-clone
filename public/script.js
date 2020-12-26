//create a reference to socket and connect to root path
const socket = io('/')

//pass three arguments to an instance of EventEmitter to the back-end using socket.io: 1. event from server.js, line 35 2. roomID from server.js, line 28 via the romm_id variable from room.ejs, line 7
socket.emit('join-room', room_id, 39)

socket.on('user-connected', userId => {
  console.log(`${userId} has joined the room`)
})