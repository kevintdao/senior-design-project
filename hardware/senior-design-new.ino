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
const int motor1pin1 = 26; // CHANGE THESE*********
const int motor1pin2 = 27;
const int motor2pin1 = 12;
const int motor2pin2 = 13;
const int en1 = 25; // does not work
const int en2 = 14; // does not work

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

double targetLats[7] = [100,100,100,100,100,100,100]; // target received from server
double targetLons[7] = [100,100,100,100,100,100,100];

double currentTargetLat; // the target to which the boat is headed currently
double currentTargetLon;

double currentLat; // current GPS location
double currentLon;

double startLat; // starting GPS location
double startLon;

double currentHead; // current heading (mag reading)

double currentBatt; // current battery level

double currentTargetDist; // distance to current target

int maxNTargets = 7; // max user entered = 6 plus a space for the starting point

int targetIndex = 0; // on way to first target

bool inSession = false;

bool atTarget = false;

bool isEmergencyStop = false;
bool isReturnToStart = false;
bool isResume = false;

double headCorrectThres = 20; // threshold for number of degrees difference between heading and bearing before auto correcting direction

bool isStopped = true;

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
          targetLats[i] = message.data()["markers"][i]["latitude"];
          targetLons[i] = message.data()["markers"][i]["longitude"];
        }
        for (int i = 0; i < maxNTargets; i++) {
          if (targetLats[i] == 100) {
            targetLats[i] = startLat; // add start value to the end of target list to return to start
            targetLons[i] = startLon;
            break;
          }
        }
      }
      if(message.data()["emergency_stop"] == true)
      {
        isEmergencyStop = true;
        emergencyStop();
      }
      else{
        isEmergencyStop = false;
      }
      if(message.data()["return_to_start"] == true)
      {
        isReturnToStart = true;
        returnToStart();
      }
      else{
        isReturnToStart = false;
      }
      if(message.data()["resume"] == true)
      {
        isResume = true;
        resume();
      }
      else{
        isResume = false;
      }
  });
}

void setupMotor() // Motors setup ------ Needs to be edited along with the motor pins
{
 const int freq = 30000;
 const int resolution = 10;
 
 // sets the pins as outputs:
 pinMode(motor1pin1, OUTPUT);
 pinMode(motor1pin2, OUTPUT);
 pinMode(en1, OUTPUT);
 pinMode(motor2pin1, OUTPUT);
 pinMode(motor2pin2, OUTPUT);
 pinMode(en2, OUTPUT);

 // configure LED PWM functionalitites
 ledcSetup(0, freq, resolution);
 ledcSetup(1, freq, resolution);

 // attach the channel to the GPIO to be controlled
 ledcAttachPin(en1, 0);
 ledcAttachPin(en2, 1);
}

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

double getCurrentHead() // TODO ***********
{
  // magnetometer compass code

}

float getTemperature()  { // TODO ***************
  

}

void headingCorrection() // turn to direction of travel
{
  stopMotors();
  delay(1000);
  double currentBear = getCurrentBear(); // target direction of travel

  if (currentBear - currentHead > headCorrectThres) {
    rightMotors();
    while (true) {
      currentHead = getCurrentHead();
      if (abs(currentHead - currentBear) < 1) {
        stopMotors();
        delay(500);
      }
    }
  }
  else if (currentHead - currentBear > headCorrectThres) {
    leftMotors();
    while (true) {
      currentHead = getCurrentHead();
      if (abs(currentHead - currentBear) < 1) {
        stopMotors();
        delay(500);
      }
    }
  }
}

// check for objects in the way -- set offset of sensors (left and right, front)
void objectDetection() {
  distance1 = getDistance1();
  distance2 = getDistance2();
  distance3 = getDistance2();
  if (distance1 < 25) {
    avoidObject("left");
  }
  else if (distance2 < 25) {
    avoidObject("front");
  }
  else if (distance3 < 25) {
    avoidObject("right");
  }
}

// correct direction for objects
void avoidObject(String whichSensor) { // string input (left, front, right) // TODO ***********
  stopMotors();
  delay(500);
  backwardsMotors(); // move backward for a couple seconds
  delay(3000);
  stopMotors(); // stop the motors
  delay(1000);
  // turn (clockwise or counterclock depending on which sensor) until there is no obstruction
  if (whichSensor == "left" || whichSensor == "front") {
    rightMotors();
    while (true) {
      distance1 = getDistance1();
      distance2 = getDistance2();
      distance3 = getDistance2();
      if (distance1 > 100 && distance2 > 100 && distance3 > 100) { // safe trajectory to proceed
        stopMotors();
        delay(1000);
        break;
      }
    }
  }
  else { // detected by right sensor
    leftMotors();
    while (true) {
      distance1 = getDistance1();
      distance2 = getDistance2();
      distance3 = getDistance2();
      if (distance1 > 100 && distance2 > 100 && distance3 > 100) { // safe trajectory to proceed
        stopMotors();
        delay(1000);
        break;
      }
    }
  }
}

// move forward -- just set the forward pins // TODO ***********
void forwardMotors() {
  isStopped = false;
  digitalWrite(motor1pin1, HIGH);
  digitalWrite(motor1pin2, LOW);
  delay(1000);

  digitalWrite(motor2pin1, HIGH);
  digitalWrite(motor2pin2, LOW);
}

// stop the motors -- just set the pins // TODO ***********
void stopMotors() {
  isStopped = true;
  digitalWrite(motor1pin1, LOW);
  digitalWrite(motor1pin2, LOW);
  digitalWrite(motor2pin1, LOW);
  digitalWrite(motor2pin2, LOW);
}

// move backward (for after running into something/object detected) -- just set the pins // TODO ***********
void backwardMotors() {
  isStopped = false;
  digitalWrite(motor1pin1, LOW);
  digitalWrite(motor1pin2, HIGH);
  digitalWrite(motor2pin1, LOW);
  digitalWrite(motor2pin2, HIGH);
}

// turn left -- just set the forward pins // TODO ***********
void leftMotors() {
  isStopped = false;
  digitalWrite(motor1pin1, HIGH);
  digitalWrite(motor1pin2, LOW);
  digitalWrite(motor2pin1, LOW);
  digitalWrite(motor2pin2, LOW);
}

// turn right -- just set the forward pins // TODO ***********
void rightMotors() {
  isStopped = false;
  digitalWrite(motor1pin1, LOW);
  digitalWrite(motor1pin2, LOW);
  digitalWrite(motor2pin1, LOW);
  digitalWrite(motor2pin2, HIGH);
}

// ultrasonic sensors get functions // TODO ***********
int getDistance1() { // left
  
}

int getDistance2() { // front // TODO ***********
  
}

int getDistance3() { // right // TODO ***********
  
}



// check whether the boat has arrived to destination
bool checkArrival() {
  // if arrived take measurements set atTarget to 1 (send and set back to 0) and then set new currentTargetLat/Lon
  if (currentTargetDist < 10) {
    if (currentTargetLat != startLat) {
      atTarget = true;
      stopMotors();
      sendDataToServer();
      atTarget = false;

      targetIndex++;
      currentTargetLat = targetLats[targetIndex]; // proceeding to next target
      currentTargetLon = targetLons[targetIndex];
    }
    return true;
  }
  return false; // not yet arrived at target
}

// stops the boat when user selects option
void emergencyStop(){
  stopMotors();
  delay(1000);
  while(true){
    pollMessage();
    if(isResume == true)
    {
      resume();
    }
    else if(isReturnToStart == true)
    {
      returnToStart();
    }
  }
}

// resume session after emergency stop
void resume() {
  headingCorrection();
  objectDetection();
  startMotors();
  isResume = false;
  isEmergencyStop = false;
}

// returns the boat to the start of the trip when the user selects option
void returnToStart() {
  currentTargetLat = startLat;
  currentTargetLon = startLon;
  headingCorrection();
  objectDetection();
  startMotors();
  isReturnToStart = false;
  isEmergencyStop = false;
}

// send json file to the server containing data to be saved in Firebase
void sendDataToServer() {
  // format into json and send to server as json
  http.begin(serverName);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST(makeJsonString(tempC, currentLat, currentLon, currentHead, currentBatt, currentTargetLat, currentTargetLon, inSession, atTarget));
}

// format JSON string
String makeJsonString(float temp, double curLat, double curLon, double curHead, double curBatt, double curTargetLat, double curTargetLon, bool inSession, bool atTarget){
    String json = "{\"api_key\":" + 3 + ",
   \"temp\":" + String(temp) + ",
    \"curLat\":" + String(curLat) + ",
     \"curLon\":" + String(curLon) + ",
      \"curHead\":" + String(curHead) + ",
       \"curBatt\":" + String(curBatt) + ",
        \"curTargetLat\":" + String(curTargetLat) + ",
         \"startLat\":" + String(startLat) + ",
          \"startLong\":" + String(startLong) + ",
           \"inSession\":" + String(inSession) + ",
            \"currentTargetDist\":" + String(currentTargetDist) + ",
            \"curTargetLon\":" + String(curTargetLon) + "}";
  return json;
}

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
    currentTargetDist = getDistance(currentLat, currentLon, currentTargetLat, currentTargetLon);
    
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
}


// * * * * * * * * * * * * * * * * * * * * * * * LOOP * * * * * * *
void loop() { 
  if (inSession) { // session has started and targets have been received
    currentHead = getCurrentHead();
    currentLat = getCurrentLat();
    currentLon = getCurrentLon();
    distance1 = getDistance1();
    distance2 = getDistance2();
    distance3 = getDistance3();
    tempC = getTemperature();
    currentBatt = getCurrentBatt();
    currentTargetDist = getDistance(currentLat, currentLon, currentTargetLat, currentTargetLon);
  
    headingCorrection(); // turn to bearing if angle between bearing and heading is > threshold
    objectDetection(); // make sure no obstructions are present, if so, correct

    if (isStopped) { 
      forwardMotors();
    }
  
    bool arrived = checkArrival(); // check if boat has arrived at target location, if so, take measurement

    sendDataToServer(); // send global variables to server
    
    // once session is complete just stop, and send it to an infinite loop to stop main loop
    if (arrived && currentTargetLat == startLat) { // returned to start
      stopMotors();
      inSession = false;
      targetLats = [100,100,100,100,100,100,100]; // reset targets
      targetLons = [100,100,100,100,100,100,100];
    }
    delay(100);
  }
  else { // not in session -- for sensor testing
    while (true) {
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
      currentTargetDist = getDistance(currentLat, currentLon, currentTargetLat, currentTargetLon);

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
