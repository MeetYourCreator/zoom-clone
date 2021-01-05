//create a reference to socket and pass in root path to connect to root path
const socket = io('/')

//since I'm using a back-end server (besides the peer server), I have to pass in two  arguments to the new instance of the Peer object: 
//1. first parameter is the userId; a value of undefined is passed in as the argument because the back-end server will be generating the userId 
//2. second paramater is an object with two key-value pairs
const peer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

//as soon as there is a connection made to the Peer Server, fire the callback function to pass in the new userId
peer.on('open', newUserId => {
  //pass three arguments to an instance of EventEmitter to the back-end using socket.io: 
  //1. the 'join-room' event from server.js, line 32 
  //2. the room_id variable from room.ejs, line 7
  //3. the newUserId
  //In other words, when a new user has joined the room, get the roomId from server.js, line 32 via the room_id variable from room.ejs, line 7 and pass in the id of the new user 
  socket.emit('join-room', room_id, newUserId)
})

const videoGrid = document.getElementById('video-grid')

//render userVideo to DOM
const renderUserVideo = () => {
  const userVideo = document.createElement('video')
    // videoGrid.appendChild(userVideo)
    userVideo.muted = true
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(userStream => {
      addVideoStream(userVideo, userStream)

      peer.on('call', call => {
        call.answer(userStream)
        const newUserVideo = document.createElement('video')
        call.on('stream', newUserVideoStream => {
        addVideoStream(newUserVideo, newUserVideoStream)
        })
      })


      //listen for new user connecting; on new 'user-connected' fire up callback function which console's thast the the new user (userId) hads connected.
      //allow ourselves toi be connected to by other users
      socket.on('user-connected', userId => {
        alert(`${userId} has joined the room`)
        connectToNewUser(userId, userStream)
      })
      
    })
  
}

renderUserVideo()

const addVideoStream = (userVideo, userStream) => {
  userVideo.srcObject = userStream
  userVideo.addEventListener('loadedmetadata', () => {
    userVideo.play()
    videoGrid.appendChild(userVideo)
  })
}

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream)
  const newUserVideo = document.createElement('video')
  call.on('stream', newUserVideoStream => {
    addVideoStream(newUserVideo, newUserVideoStream)
  })
  call.on('close', () => {
    newUserVideo.remove()
  })
}