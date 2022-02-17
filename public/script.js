//create a reference to socket and pass in root path to connect to root path
const socket = io('/')

//since I'm using a back-end server (besides the peer server), I have to pass in two  arguments to the new instance of the Peer object: 
//1. first parameter is the userId; a value of undefined is passed in as the argument because the back-end server will be generating the userId 
//2. second paramater is an object with two key-value pairs
const peer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

const peers = {}

const renderVideo = () => {

  const videoGrid = document.getElementById('video-grid')
  const userVideo = document.createElement('video')
  userVideo.muted = true

  //as soon as there is a connection made to the Peer Server, fire the callback function to pass in the new userId
  peer.on('open', newUserId => {
    //pass three arguments to an instance of EventEmitter to the back-end using socket.io: 
    //1. the 'join-room' event from server.js, line 32 
    //2. the room_id variable from room.ejs, line 7
    //3. the newUserId
    //In other words, when a new user has joined the room, get the roomId from server.js, line 32 via the room_id variable from room.ejs, line 7 and pass in the id of the new user 
    socket.emit('join-room', room_id, newUserId)
  })

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    addVideoStream(userVideo, stream)
    peer.on('call', call => {
      call.answer(stream)
      const remoteVideo = document.createElement('video')
      call.on('stream', remoteStream => {
        addVideoStream(remoteVideo, remoteStream)
      })
    })
    //listen for new user connecting; on new 'user-connected' fire up callback function which console's thast the the new user (userId) hads connected.
    //allow ourselves to be connected to by other users
    socket.on('user-connected', userId => {
      connectToNewUser(userId, stream)
      alert(`${userId} has joined the room`)
    })
  })

  //listen for user disconnecting from room
  socket.on('user-disconnected', userId => {
    if (peers[userId]) {
      alert(`User disconnected: ${userId}`)
      peers[userId].close()
    }
  })

  const addVideoStream = (userVideo, stream) => {
    userVideo.srcObject = stream
    userVideo.addEventListener('loadedmetadata', () => {
      userVideo.play()
      videoGrid.append(userVideo)
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
    //link every userId to a call
    peers[userId] = call
  }
}

renderVideo()