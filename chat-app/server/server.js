const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const app = express();

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require('./utils/isRealString');
const { Users } = require('./utils/user');

const publicPath = path.join(__dirname, "/../public");

let server = http.createServer(app);
let io = socketIO(server);
const users = new Users()

app.use(express.json());
app.use(express.static(publicPath));


io.on("connection", (socket) => {
  console.log("A new user just connected");

  socket.on('join', function (params,callback) {
    if(!isRealString.name || !isRealString.room) {
      return callback("Name and room are required!")
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room)

    io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
    socket.emit(
      "newMessage",
      generateMessage("Admin", `Welcome to ${params.room}`)
    );
  
    socket.broadcast.to(params.room).emit(
      "newMessage",
      generateMessage("Admin", "New user connected!")
    );

    callback()
  })

  socket.on("createMessage", (message, callback) => {

    let user = users.getUser(socket.id)

    if(user && isRealString(message.text)) {
      io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
    }

    callback("This is server");
  })

    socket.on("createLocationMessage", (coords) => {
      let user = users.getUser(socket.id)

      if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        generateLocationMessage(user.name, coords.lat, coords.lng)
      );
      }
    });
s
    socket.on("disconnect", () => {
      let user = users.removeUser(socket.id)

      if(user) {
        io.to(user.room).emit('updateUsersList', users.getUserList(user.room))
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room`))
      }
    });
  });


const port = 3000;
server.listen(port, () => {
  console.log("Server running");
});
