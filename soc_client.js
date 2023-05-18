// ES modules
const { io } = require("socket.io-client");
const socket=io("ws://localhost:3000")
socket.on('connect', function(){

  console.log('Connected to Server')
 
});
socket.on('msg', function(msg){

   console.log('Server says'+msg)

 });
