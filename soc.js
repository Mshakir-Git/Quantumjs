import { Server } from "socket.io";

import http from 'http'

export const port = process.env.PORT||3000 // setting the port 
let server = http.createServer()
let io = new Server(server)

io.on('connection', (socket)=>{
  console.log('New user connected');
});
setTimeout(()=>io.emit("msg","hello"),6000)
server.listen(port);
