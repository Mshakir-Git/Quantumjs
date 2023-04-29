const socketIO = require('socket.io');

const http = require('http') 

const port = process.env.PORT||3000 // setting the port 
let server = http.createServer()
let io = socketIO(server)

io.on('connection', (socket)=>{
  console.log('New user connected');
});
setTimeout(()=>io.emit("msg","hello"),6000)
server.listen(port);
