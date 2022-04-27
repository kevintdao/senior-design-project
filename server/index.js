require('dotenv').config()
const express = require('express')
var admin = require("firebase-admin");

var serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount || JSON.stringify(process.env.GOOGLE_CREDENTIALS)),
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
// send hardware data to Firebase
app.post('/send_data', (req, res) => {
  const time = admin.firestore.Timestamp.fromDate(new Date())
  ref.update({
    battery: 90,
    timestamp: time.toDate()
  })
  res.send('done')
})

// send Firebase data to hardware
var data;
ref.on('value', snapshot => {
  data = snapshot.val()
})
app.get('/get_data', (req, res) => {
  res.send(data)
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})