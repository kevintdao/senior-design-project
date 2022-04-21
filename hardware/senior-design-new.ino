// Senior Design Spring 2022 - Team NULL

// * * * * * * * * * * * * * * C libraries * * * * * * * 
#include <TinyGPSPlus.h>
#include <SoftwareSerial.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoWebsockets.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

// * * * * * * * * * * * * * * * * * * * * * * * PIN VALUES * * * * * * * 
// motor pins
const int motor1pin1 = 5; // CHANGE THESE*********
const int motor1pin2 = 6;
const int motor2pin1 = 9;
const int motor2pin2 = 8;

// GPS pins
static const int RXPin = 9;
static const int TXPin = 10;

// Ultrasonic-Sensor HC-SR04 pins
const int echoPin = 35;
const int trigPin = 32;

// Temperature pins
const int tmpPin = 33;



// * * * * * * * * * * * * * * * * * * * * * * * VARIABLES * * * * * * * 
OneWire oneWire(tmpPin);
DallasTemperature sensors(&oneWire); 
float tempC = -127; // temperature variables

#define PI 3.141592654 // pi definition

TinyGPSPlus gps;
SoftwareSerial ss(RXPin, TXPin); // gps variables

websockets::WebsocketsClient client; // web socket client variable
HTTPClient http;
const String serverName = "..../send_data";


int distance1;  // distance measurement (ultrasonic sensor variables) - left
int distance2;  // distance measurement (ultrasonic sensor variables) - front
int distance3;  // distance measurement (ultrasonic sensor variables) - right

int dutyCycle = 255; // motor duty cycle variable

double targetLats[6] = [100,100,100,100,100,100]; // target received from server
double targetLons[6] = [100,100,100,100,100,100];

double currentTargetLat; // the target to which the boat is headed currently
double currentTargetLon;

double currentLat; // current GPS location
double currentLon;

double startLat; // starting GPS location
double startLon;

double currentHead; // current heading (mag reading)

double currentBatt; // current battery level

int maxNTargets = 6; // check this with Truong******

bool inSession = false;

bool atTarget = false;

// * * * * * * * * * * * * * * * * * * * * * * * SETUP HELPER FUNCTIONS * * * * * * *
void GPSsetup() // GPS setup
{
  static const uint32_t GPSBaud = 9600;
  ss.begin(GPSBaud);
}

void setupUltra() // Ultrasonic sensor setup
{
  pinMode(echoPin, INPUT);
  pinMode(trigPin, OUTPUT);
}

void setupTemp() // Temp sensor setup
{
  sensors.begin();
}

void setupWiFi() // Wifi module setup
{
  const char *ssid = "ssid";
  const char *password = "pass";
  const char *host = "frozen-chamber-50976.herokuapp.com"; // CHANGE HOST HERE
  const uint16_t port = 80;
  
  // Connect to wifi
  WiFi.begin(ssid, password);
  // Check if connected to wifi
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Connecting to WiFi..");
    delay(500);
  }
  Serial.println("Connected to Wifi");
  Serial.println(WiFi.localIP());

  bool connected = client.connect(host, port, "/");
  if (connected)
  {
    Serial.println("Connected!");
  }

  // run callback when messages are received
  client.onMessage([&](websockets::WebsocketsMessage message){
      if (targetLats[0] == 100) {
        // set marker > 0 > latitude
        for (int i = 0; i < maxNTargets; i++) {
          //set marker > i > latitude/longitude
          targetLats[i] = 
          targetLons[i] = 
        }
        for (int i = 0; i < maxNTargets; i++) {
          if (targetLats[i] == 100) {
            targetLats[i] = startLat; // add start value to the end of target list to return to start
            targetLons[i] = startLon;
          }
        }
      }

      // handling commands from user ie. emergency stop TODO *********
  });
}

//void setupMotor() // Motors setup ------ Needs to be edited along with the motor pins
//{
//  const int freq = 30000;
//  const int resolution = 10;
//  
//  // sets the pins as outputs:
//  pinMode(motor1pin1, OUTPUT);
//  pinMode(motor1pin2, OUTPUT);
//  pinMode(en1, OUTPUT);
//  pinMode(motor2pin1, OUTPUT);
//  pinMode(motor2pin2, OUTPUT);
//  pinMode(en2, OUTPUT);
//
//  // configure LED PWM functionalitites
//  ledcSetup(0, freq, resolution);
//  ledcSetup(1, freq, resolution);
//
//  // attach the channel to the GPIO to be controlled
//  ledcAttachPin(en1, 0);
//  ledcAttachPin(en2, 1);
//}

//void setupMotor() // Motors setup
//{
//  pinMode(motor1pin1, OUTPUT);
//  pinMode(motor1pin2, OUTPUT);
//  pinMode(motor2pin1, OUTPUT);
//  pinMode(motor2pin2, OUTPUT);
//}

// * * * * * * * * * * * * * * * * * * * * * * * OTHER HELPER FUNCTIONS * * * * * * *
void pollMessage() // Poll the web client
{
  if (client.available())
  {
    client.poll();
  }
}

// calculate direction of travel in degrees (arg units -- degrees)
double getBearing(double currentLat, double currentLon, double targetLat, double targetLon)
{
  currentLat = currentLat * PI / 180; // convert to radians
  currentLon = currentLon * PI / 180;
  targetLat = targetLat * PI / 180;
  targetLon = targetLon * PI / 180;
  double x = cos(targetLat) * sin(targetLon - currentLon);
  double y = (cos(currentLat) * sin(targetLat)) - (sin(currentLat) * cos(targetLat) * cos(targetLon - currentLon));
  double b = atan2(x, y) * 180 / PI; // convert back to degrees
  return b;
}

// calculate distance to target in meters
double getDistance(double currentLat, double currentLon, double targetLat, double targetLon)
{
  currentLat = currentLat * PI / 180; // convert to radians
  currentLon = currentLon * PI / 180;
  targetLat = targetLat * PI / 180;
  targetLon = targetLon * PI / 180;
  double deltaLat = targetLat - currentLat;
  double deltaLon = targetLon - currentLon;
  double a = pow(sin(deltaLat / 2), 2) + (cos(currentLat) * cos(targetLat) * pow(sin(deltaLon / 2), 2));
  double c = 2 * atan2(sqrt(a), sqrt(1 - a));
  double d = c * 6371000;
  return d;
}

double getCurrentLat()
{
  if (gps.location.isValid())
  {
    return gps.location.lat();
  }
  else
  {
    return 911; // invalid reading - if lat or lng = 911 halt the boat
  }
}

double getCurrentLon()
{
  if (gps.location.isValid())
  {
    return gps.location.lng();
  }
  else
  {
    return 911; // invalid reading
  }
}

double getCurrentHead()
{
  return 0;
  // insert magnetometer code here
}

void headingCorrection(double targetBear) // turn to direction of travel
{
  double currentBear = getCurrentBear();
  // turn until currentHead == targetBear
}

// check for objects in the way -- set offset of sensors (left and right, front)
void objectDetection(int d1, int d2, int d3) {
  
}

// correct direction for objects
void avoidObject(int whichSensor) { // input 1,2,3 (left, front, right sensor)
  backwardsMotors(); // move backward for a couple seconds
  delay(2500);
  stopMotors(); // stop the motors
  // turn (clockwise or counterclock depending on which sensor) until there is no obstruction
  // ........
}

// move forward -- just set the forward pins
void forwardMotors() {
  
}

// stop the motors -- just set the pins
void stopMotors() {
  
}

// move backward (for after running into something) -- just set the pins
void backwardMotors() {
  
}

// ultrasonic sensors get functions
int getDistance1() { // left
  
}

int getDistance2() { // front
  
}

int getDistance3() { // right
  
}

// check whether the boat has arrived to destination
void checkArrival() {
  
}

// send json file to the server containing data to be saved in Firebase
void sendDataToServer() {
  // format into json and send to server as json
  http.begin(serverName);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST(makeJsonString(tempC, currentLat, currentLon, currentHead, currentBatt, currentTargetLat, currentTargetLon, inSession, atTarget));
}


String makeJsonString(double temp, double curLat, double curLon, double curHead, double curBatt, double curTargetLat, double curTargetLon, bool inSession, bool atTarget){
    String json = "{\"api_key\":" + 3 + ",
   \"temp\":" + String(temp) + ",
    \"curLat\":" + String(curLat) + ",
     \"curLon\":" + String(curLon) + ",
      \"curHead\":" + String(curHead) + ",
       \"curBatt\":" + String(curBatt) + ",
        \"curTargetLat\":" + String(curTargetLat) + ",
         \"inSession\":" + String(inSession) + ",
          \"curTargetLon\":" + String(curTargetLon) + "}";
  return json;
}
// get messages from the server targets, em stop, RTS, resume


// * * * * * * * * * * * * * * * * * * * * * * * SETUP * * * * * * *
void setup() {
  setupTemp(); // temp sensor setup
  GPSsetup(); // GPS setup
  setupMag(); // magnetometer setup
  setupUltra(); // setup ultrasonic sensors
  setupMotors(); // setup motors
  setupWifi();  // setup wifi connection + receiving messages from the server
  
  // infinite loop which is broken only if targets are received from the server
  while (true) {
    pollMessage();
    if (targetLats[0] != 100) {
      inSession = true;
      break;
    }
    sendDataToServer();
    delay(1000);
  }

  currentTargetLat = targetLats[0];
  currentTargetLon = targetLons[0];
  startLat = getCurrentLat();
  startLon = getCurrentLon();

  currentHead = getCurrentHead();
  currentLat = getCurrentLat();
  currentLon = getCurrentLon();
  distance1 = getDistance1();
  distance2 = getDistance2();
  distance3 = getDistance3();
  tempC = getTemperature();
  currentBatt = getCurrentBatt();


  headingCorrection(); // turn to bearing
  objectDetection(); // make sure no obstructions are present, if so, correct
  forwardMotors(); // move forward
}



// * * * * * * * * * * * * * * * * * * * * * * * LOOP * * * * * * *
void loop() { // session has started and targets have been received
  if (inSession) {
    currentHead = getCurrentHead();
    currentLat = getCurrentLat();
    currentLon = getCurrentLon();
    distance1 = getDistance1();
    distance2 = getDistance2();
    distance3 = getDistance3();
    tempC = getTemperature();
    currentBatt = getCurrentBatt();
  
  
    headingCorrection(); // turn to bearing if angle between bearing and heading is > threshold
    objectDetection(); // make sure no obstructions are present, if so, correct
    // *** above functions should make motors move forward if resulting in stop
  
    bool arrived = checkArrival(); // check if boat has arrived at target location, if so, take measurement

    sendDataToServer();
    
    
    // once session is complete just stop, and send it to an infinite loop to stop main loop
    if (arrived && currentTargetLat == startLat) { // returned to start
      inSession = false;
      targetLats = [100,100,100,100,100,100]; // reset targets
      targetLons = [100,100,100,100,100,100];
    }
  }
  else { // not in session -- for sensor testing
    while (true) {
      pollMessage();
      if (targetLats[0] != 100) {
        inSession = true;
        break;
      }
      sendDataToServer();
      delay(1000);
    }
  }
}
