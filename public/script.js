//create a reference to socket and pass in root path to connect to root path
const socket = io('/')

//since I'm using a back-end server (besides the peer server), I have to pass in two  parameters to the new instance of the Peer object: 1. first parameter is the id; pass in a value of undefined because the serve will be generating the userId 2. second paramater is an object with two key-value pairs
const peer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

//as soon as there is a connection made to the Peer Server and get back and id, fire the callback function to pass in the new userId
peer.on('open', id => {
  //pass three arguments to an instance of EventEmitter to the back-end using socket.io: 1. when a new user has 'joined-room' server.js, line 35 2. get the roomID from server.js, line 28 via the romm_id variable from room.ejs, line 7 3. pass in the id of the new user 
  socket.emit('join-room', room_id, id)
})


//listen for new user connecting; on mnew 'user-connected' fire up callback function which console's thast the the new user (userId) hads connected.
socket.on('user-connected', userId => {
  alert(`${userId} has joined the room`)
})

//render video to DOM
const videoGrid = document.getElementById('video-grid')
const newUserVideo = document.createElement('video')
videoGrid.appendChild(newUserVideo)
newUserVideo.muted = true
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(newUserVideo, stream)
})

const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
}