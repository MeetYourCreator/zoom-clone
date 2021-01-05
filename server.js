const chalk = require('chalk')
const error = chalk.bold.red

//create an express server
const express = require('express')

//create app variable initialized with running the expresss function; the app variable is initialized as the express function
const app = express()

//instantiate a Server based on ExpressJS and pass it the app variable. This creates a server to be used with socket.io
const server = require('http').createServer(app)

//import socket.io and pass it the server variable. This way socket.io knows which server is being used and how to interact with that server.
const io = require('socket.io')(server)

//specify which port to start up the server on (port 3000)
server.listen(3000)

//line 21 - 22
const { v4: uuidV4 } = require('uuid')

//set up the express server for (first argument) the view engine and (second argument) how the views are going to be rendered 
app.set('view engine', 'ejs')

//set up the static/public folder. 
app.use(express.static('public'))

//create route for getting root/home, first argument is the route, second argument is a callback function which takes two parameters, request and response.
app.get('/', (request, response) => {
  //redirect user to dynamic room, line 24
  // response.redirect(`/${roomId}`)
  // instead of passing roomId, call the uuidV4 function (declared in line 12) to get a dynamic url by appemnding a randfom uuid to localhost:3000, e.g: http://localhost:3000/0e5ce052-8b71-4f7a-a397-f17c3e7d6971
  response.redirect(`/${uuidV4()}`)
  //Error: Failed to lookup view '/:room' in views directory. Resolve by createing views directory with a room.ejs file
})
//create route for chat rooms, first argument is the route, second argument is a callback function which takes two parameters, request and response
app.get('/:room', (request, response) => {
  //render room from room route/ parameter (first argument) and pass down room id (second argument)
  response.render('room', { roomId: request.params.room })
})

//handle on server with socket.io; this wil run anytime someone connects to the application. The on method takes two arguments: 1. name of the event to handle; 2. callback function to fire on event
io.on('connection', socket => {
  //set up events to listen to
  //Event 1: someone connects to a room; using on method with arguments: 1. whenever someone joins a room, 'join-room' 2.fire callback fucntion with two parameters (roomId and userId) to A: join the specific room B: send boradcast message (message sent to all other users in the room but not sent back to client) to specific room (roomId)
  socket.on('join-room', (roomId, userId) => {
    console.log(chalk.bold.blue(roomId))
    console.log(chalk.yellow(userId))
    //A: join ther specific room (roomId)
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
  })

})