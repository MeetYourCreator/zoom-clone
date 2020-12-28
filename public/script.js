//create a reference to socket and pass in root path to connect to root path
const socket = io('/')

//since I'm using a back-end server (besides the peer server), I have to pass in two  parameters to the new instance of the Peer object: 1. first parameter is the id; pass in a value of undefined because the back-end server will be generating the userId 2. second paramater is an object with two key-value pairs
const peer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

//as soon as there is a connection made to the Peer Server, fire the callback function to pass in the new userId
peer.on('open', newUserid => {
  //pass three arguments to an instance of EventEmitter to the back-end using socket.io: 
  //1. the 'join-room' event from server.js, line 32 
  //2. the room_id variable from room.ejs, line 7
  //3. the new userId
  //In other words, when a new user has joined the room, get the roomID from server.js, line 32 via the room_id variable from room.ejs, line 7 and pass in the id of the new user 
  socket.emit('join-room', room_id, newUserid)
})

//listen for new user connecting; on new 'user-connected' fire up callback function which console's thast the the new user (userId) hads connected.
socket.on('user-connected', userId => {
  alert(`${userId} has joined the room`)
})

//render userVideo to DOM
const renderUserVideo = () => {
  const videoGrid = document.getElementById('video-grid')
  const userVideo = document.createElement('video')
  videoGrid.appendChild(userVideo)
  userVideo.muted = true
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(userStream => {
    addVideoStream(userVideo, userStream)
  })
  const addVideoStream = (userVideo, userStream) => {
    userVideo.srcObject = userStream
    userVideo.addEventListener('loadedmetadata', () => {
      userVideo.play()
    })
  }
}

renderUserVideo()