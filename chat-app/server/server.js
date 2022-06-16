const express = require("express")
const path = require('path')
const http = require('http'); 
const socketIO = require('socket.io');
const { disconnect } = require("process");

const app = express();
const publicPath = path.join(__dirname, '/../public')

let server = http.createServer(app)
let io = socketIO(server)

app.use(express.json())
app.use(express.static(publicPath))

io.on("connection", (socket) => {
    console.log("A new user just connected");

    socket.on("disconnect", () => {
        console.log("User was disconnect");
    })
})

const port = process.env.PORT || 3300
server.listen(port, () => {
    console.log("Server running");
}) 