require('dotenv').config()
const express = require('express')
var admin = require("firebase-admin");

var serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://senior-design-project-ceb4f-default-rtdb.firebaseio.com/'
});

var firestoreDB = admin.firestore()
var realtimeDB = admin.database()

const app = express()

const server = require('http').createServer(app)
const bodyParser = require('body-parser')
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server: server })
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send("Hello World")
  // console.log(firestoreDB.collection('users').doc('test@test.com').get().then(doc => {
  //   console.log(doc.data())
  // }))
  const ref = realtimeDB.ref('/')
  ref.on('value', snapshot => {
    console.log(snapshot.val())
  })
})

app.post('/send_data', (req, res) => {

})

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})