//create a reference to socket and pass in root path to connect to root path
const socket = io('/')

//since I'm using a back-end server (besides the peer server), I have to pass in two  parameters to the new instance of the Peer object: 1. first parameter is the id; pass in a value of undefined because the serve will be generating the userId 2. second paramater is an object with two key-value pairs
let peer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

//pass three arguments to an instance of EventEmitter to the back-end using socket.io: 1. event from server.js, line 35 2. roomID from server.js, line 28 via the romm_id variable from room.ejs, line 7
socket.emit('join-room', room_id, 39)

//listen for new user connecting; on mnew 'user-connected' fire up callback function which console's thast the the new user (userId) hads connected.
socket.on('user-connected', userId => {
  console.log(`${userId} has joined the room`)
})