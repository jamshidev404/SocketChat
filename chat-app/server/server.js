const express = require("express")
const path = require('path')

const app = express();
const publicPath = path.join(__dirname, '/../public')

app.use(express.json())
app.use(express.static(publicPath))

const port = process.env.PORT || 3300
app.listen(port, () => {
    console.log("Server running");
}) 