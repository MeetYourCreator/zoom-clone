//create an express server
const express = require('express')
//create app variable initialized with running the expresss function; the app variable is initialized as the express function
const app = express()
//instantiate a Server based on ExpressJS and pass it the app variable. Thjis allows us to create a server to be used with socket.io
const server = require('http').Server(app)
//import socket.io and pass it the server variable. This way socket.io knows which server we're using and how to interact with that server.
const io = require('socket.io')(server)
//specify which port to start up the server on (port 3000; aka localhost)
server.listen(3000)

//set up the express server for (first argument) the view engine and (second argument) how the views are going to be rendered 
app.set('view engine', 'ejs')
//set up the static/public folder. 
app.use(express.static('public'))
//create route for getting root/home, first argument is the route, second argument is a callback function which takes two parameteres, request and response.
app.get('/', (request, response) => {

})
//create route for chat rooms, first argument is the route, second argument is a callback function which takes two parameters, request and response
app.get('/:room', (request, response) => {

})