const express = require('express')
const bodyParser = require('body-parser')
const socketio = require('socket.io')  //providing a bi-directional communication channel between a client and a server. ... Whenever you write a chat message, the idea is that the server will get it and push it to all other connected clients.
const dotenv = require('dotenv')
const http = require('http')
var cors = require('cors')
const users = require('./user');
const app = express();
dotenv.config();
require("./config/db")

app.use(cors())

const port = process.env.PORT || 4400
const server = http.createServer(app)
const io = socketio(server)


const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const { Socket } = require('dgram')

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//all chat code run inside this fucntion because we r managing specific socket 

const User = require('./models/user')
const Message = require('./models/message')
io.on("connection", socket => {
    let friendIdUser
    // socket.emit("your id", socket.id);
    socket.on("your id",id =>{
        let sender = users.create(socket,id);
     })
     socket.on("send message",async({body,to,from})=>{
        console.log("b",body,"uid", from,"fid", to);
       const yourIdUser =await User.findOne({ _id: from });
      friendIdUser =await  User.findOne({ _id: to});
    
       var obj ={
             from:yourIdUser._id,
             to:friendIdUser._id,
             body:body,         
       }
      const mesg = new Message(obj)
      mesg.save();
            const receiver = users.get(friendIdUser._id);
            receiver.emit("message",{body,from,to})
    })
})




app.use(userRoutes);
app.use(postRoutes);


if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


server.listen(port,()=>
    console.log(`server is running on port no : ${port}`)
)
