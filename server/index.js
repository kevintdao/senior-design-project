require('dotenv').config()
const express = require('express')
var admin = require("firebase-admin");

var serviceAccount = require("./google-credentials.json")

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
})

const ref = realtimeDB.ref('/')

var data;
ref.on('value', snapshot => {
  data = snapshot.val()
})
// send hardware data to Firebase
app.post('/send_data', (req, res) => {
  const body = req.body;
  const time = admin.firestore.Timestamp.fromDate(new Date())
  ref.update({
    battery: body.curBatt,
    temperature: body.temp,
    start: {
      latitude: body.curLat,
      longtitude: body.curLon
    },
    timestamp: time.toDate()
  })
  res.send(data)
})

// send Firebase data to hardware
app.get('/get_data', (req, res) => {
  res.send(data)
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})