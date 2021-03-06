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
var sessionId;
var isSessionIdSet = false
ref.on('value', snapshot => {
  data = snapshot.val()
})
// send hardware data to Firebase
app.post('/send_data', (req, res) => {
  const body = req.body;
  console.log(body)
  const time = admin.firestore.Timestamp.fromDate(new Date())
  ref.update({
    latitude: parseInt(body.curLat),
    longitude: parseInt(body.curLon),
    battery: parseInt(body.curBatt),
    temperature: parseInt(body.temp),
    start: {
      latitude: parseInt(body.startLat),
      longtitude: parseInt(body.startLong)
    },
    timestamp: time.toDate()
  })
  if(body.in_session && !isSessionIdSet) {
    const setSession = async () => {
      const session = await firestoreDB.collection('users').doc(data.user).collection('sessions').add({
        start: 'start',
        end: 'end'
      })
      sessionId = session.id
    }
    setSession()
    isSessionIdSet = true
  }

  if(body.atTarget) {
    const setData = async () => {
      const sessData = await firestoreDB.collection('users').doc(data.user).collection('sessions').doc(sessionId).collection('data').add({
        temperature: 30,
        lat: 41.69,
        long: -91.53,
        time: admin.firestore.Timestamp.fromDate(new Date()).toDate()
      })
      console.log(sessData.id)
    }

    setData()
  }

  if(!body.in_session) {
    isSessionIdSet = false
  }
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
    ref.update({
      markers: data.markers
    })
  }
  res.send(data)
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

wss.on('connection', (ws) => {
  console.log("a client connected")
})