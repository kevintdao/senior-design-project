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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.get('/', (req, res) => {
  console.log('Here')
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
  console.log(body)
  const time = admin.firestore.Timestamp.fromDate(new Date())
  ref.update({
    battery: parseInt(body.curBatt),
    temperature: parseInt(body.temp),
    start: {
      latitude: parseInt(body.curLat),
      longtitude: parseInt(body.curLon)
    },
    timestamp: time.toDate()
  })
  console.log('send data');
  res.send(data)
})

// send Firebase data to hardware
app.get('/get_data', (req, res) => {
  console.log('get data');
  if(data.in_session == false) {
    data.markers = [
      { latitude: 100, longtitude: 100 },
      { latitude: 100, longtitude: 100 },
      { latitude: 100, longtitude: 100 },
      { latitude: 100, longtitude: 100 },
      { latitude: 100, longtitude: 100 },
      { latitude: 100, longtitude: 100 },
    ]
  }
  res.send(data)
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

wss.on('connection', (ws) => {
  console.log("a client connected")
})