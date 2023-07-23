import express from 'express'
import http from 'http'
import {Server} from  'socket.io'

const app = express();

const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:['http://localhost:3000','http://192.168.1.109:3000']
    }
})

io.on('connection',(socket)=>{
    socket.join('room')

    console.log("User connected!");

    socket.on('send_message',(data)=>{
        socket.to('room').emit('received_message',data)
    })
    
    socket.on('disconnect',()=>{
        console.log("User disconnected");
    })
    
})

app.get('/',(req,res)=>{
    res.send("<h1>Hello from socket-io server</h1>")
})


server.listen(4000, () => {
    console.log("server running at 4000");
})
