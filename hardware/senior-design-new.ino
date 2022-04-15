// Senior Design Spring 2022 - Team NULL

// * * * * * * * * * * * * * * C libraries * * * * * * * 
#include <TinyGPSPlus.h>
#include <SoftwareSerial.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoWebsockets.h>
#include <WiFi.h>
#include <ArduinoWebsockets.h>


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

long duration1; // duration of sound wave travel LEFT
int distance1;  // distance measurement (ultrasonic sensor variables)
long duration2; // duration of sound wave travel FRONT
int distance2;  // distance measurement (ultrasonic sensor variables)
long duration3; // duration of sound wave travel RIGHT
int distance3;  // distance measurement (ultrasonic sensor variables)

int dutyCycle = 255; // motor duty cycle variable

double targetLats[6] = {100,100,100,100,100,100}; // target received from server
double targetLons[6] = {100,100,100,100,100,100};

double currentTargetLat; // the target to which the boat is headed currently
double currentTargetLon;



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

void setupMotor() // Motors setup
{
  pinMode(motor1pin1, OUTPUT);
  pinMode(motor1pin2, OUTPUT);
  pinMode(motor2pin1, OUTPUT);
  pinMode(motor2pin2, OUTPUT);
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
  client.onMessage([&](websockets::WebsocketsMessage message)
                   { Serial.println(message.data()); });
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

double getCurrentBear()
{
  return 0;
  // insert magnetometer code here
}

void turnToBearing(double targetBear) // turn to direction of travel
{
  double currentBear = getCurrentBear();
  // turn until currentBear == targetBear
}

// check for objects in the way -- set offset of sensors (left and right, front)
void objectDetection() {
  
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

// send json file to the server containing data to be saved in Firebase
void sendDataToServer(double temp, double curLat, double curLon, double curBear, double curBatt, double curTargetLat, double curTargetLon) {
  // format into json and send to server as json
}

// get messages from the server targets, em stop, RTS, resume


// * * * * * * * * * * * * * * * * * * * * * * * SETUP * * * * * * *
void setup() {
  // insert above setup functions and comments

  // infinite loop which is broken only if targets are received from the server
  while(true) {
    // if the targets are received from the server
    // update targetLats and targetLons
  }
}



// * * * * * * * * * * * * * * * * * * * * * * * LOOP * * * * * * *
void loop() { // session has started and targets have been received

  // once session is complete just stop, and send it to an infinite loop to stop main loop
  
}
