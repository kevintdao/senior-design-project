require('dotenv').config()
const express = require('express')
var admin = require("firebase-admin");

var serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express()

const server = require('http').createServer(app)
const bodyParser = require('body-parser')
const WebSocket = require('ws')

const wss = new WebSocket.Server({ server: server })
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send("Hello World")
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
  console.log(admin)
})