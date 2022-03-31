// Senior Design Spr 2022 - Team NULL

// C libraries
#include <TinyGPSPlus.h>
#include <SoftwareSerial.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoWebsockets.h>
#include <WiFi.h>

#define PI 3.141592654

// L293D Motor driver pin setup and loop
const int motor1pin1 = 5;
const int motor1pin2 = 6;
const int motor2pin1 = 9;
const int motor2pin2 = 8;

void setupMotor()
{
  pinMode(motor1pin1, OUTPUT);
  pinMode(motor1pin2, OUTPUT);
  pinMode(motor2pin1, OUTPUT);
  pinMode(motor2pin2, OUTPUT);
}

void loopMotor()
{
  //  Turn both motors clockwise and counter clockwise with 1s delay
  analogWrite(motor1pin1, 255);
  analogWrite(motor1pin2, 0);
  delay(1000);

  analogWrite(motor1pin1, 0);
  analogWrite(motor1pin2, 255);
  delay(1000);

  analogWrite(motor2pin1, 255);
  analogWrite(motor2pin2, 0);
  delay(1000);

  analogWrite(motor2pin1, 0);
  analogWrite(motor2pin2, 255);
  delay(1000);
}

// GPS setup
static const int RXPin = 9;
static const int TXPin = 10;
static const uint32_t GPSBaud = 9600;
TinyGPSPlus gps;
SoftwareSerial ss(RXPin, TXPin);

void GPSsetup()
{
  ss.begin(GPSBaud);
}
// SENSORS setup
// Ultrasonic-Sensor HC-SR04 pin setup and loop
const int echoPin = 35;
const int trigPin = 32;

void setupUltra()
{
  pinMode(echoPin, INPUT);
  pinMode(trigPin, OUTPUT);
}

// defines variables
long duration; // variable for the duration of sound wave travel
int distance;  // variable for the distance measurement

void loopUltra()
{
  // Clears the trigPin condition
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin HIGH (ACTIVE) for 10 microseconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
  // Calculating the distance
  distance = duration * 0.034 / 2; // Speed of sound wave divided by 2 (go and back)
  // Displays the distance on the Serial Monitor
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
}

// Temperature
const int tmpPin = 33;
OneWire oneWire(tmpPin);
DallasTemperature sensors(&oneWire);
float tempC = -127;
float tempF = -196;

void setupTemp()
{
  sensors.begin();
}

void loopTemp()
{
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);
  float tempF = sensors.getTempFByIndex(0);

  Serial.print("Temperature: " + String(tempC) + " ºC |");
  Serial.println(String(tempF) + " ºF");

  delay(1000);
}

// Wifi module pin setup
const char *ssid = "ssid";
const char *password = "pass";
const char *host = "frozen-chamber-50976.herokuapp.com";
const uint16_t port = 80;

websockets::WebsocketsClient client;

void setupWiFi()
{
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

// #define VOLTAGE_PIN 13 // replace 13 with correct pin

// void setupBatteryReading(){
//   pinMode(VOLTAGE_PIN, INPUT)
// }

// void loopBattery(){
//   analogRead(VOLTAGE_PIN);
//   delay(10000); //10 second delay
// }

// Ultrasonic sensor pin setup
void loopWiFi()
{
  pollMessage();
  client.send(String(tempC));
}

void pollMessage()
{
  if (client.available())
  {
    client.poll();
  }
}
// hotspot setup for wifi module

// L293D Motor driver pin setup and loop
const int en1 = 25; // does not work
const int motor1pin1 = 26;
const int motor1pin2 = 27;
const int en2 = 14; // does not work
const int motor2pin1 = 12;
const int motor2pin2 = 13;

// Setting PWM properties
const int freq = 30000;
const int resolution = 10;
int dutyCycle = 255;
int COMMAND = 1;

void setupMotor()
{
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

  // testing
  Serial.print("Testing DC Motor...");
}

void loopMotor()
{

  ledcWrite(0, dutyCycle);
  ledcWrite(1, dutyCycle);

  // Turn the boat based on the COMMAND

  // Forward
  if (COMMAND == 1)
  {
    digitalWrite(motor1pin1, HIGH);
    digitalWrite(motor1pin2, LOW);
    delay(1000);

    digitalWrite(motor2pin1, HIGH);
    digitalWrite(motor2pin2, LOW);

    COMMAND = 2;
    delay(5000);
  }

  // Backward
  if (COMMAND == 2)
  {
    digitalWrite(motor1pin1, LOW);
    digitalWrite(motor1pin2, HIGH);
    digitalWrite(motor2pin1, LOW);
    digitalWrite(motor2pin2, HIGH);

    COMMAND = 3;
    delay(5000);
  }

  // Left
  if (COMMAND == 3)
  {
    digitalWrite(motor1pin1, HIGH);
    digitalWrite(motor1pin2, LOW);
    digitalWrite(motor2pin1, LOW);
    digitalWrite(motor2pin2, LOW);

    COMMAND = 4;
    delay(5000);
  }

  // Right
  if (COMMAND == 4)
  {
    digitalWrite(motor1pin1, LOW);
    digitalWrite(motor1pin2, LOW);
    digitalWrite(motor2pin1, LOW);
    digitalWrite(motor2pin2, HIGH);

    COMMAND = 1;
    delay(5000);
  }
}

// Calculate battery level

////// Boat variables //////
// boat state
boolean ready = false;
// boat speed
// boat location (coordinates)
// boat battery level
// target location (coordinates)
// sensor1 measurement
// current time/time of measurement ??
// current direction/heading (via magnetometer)
// target direction/heading (via calculation)

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(9600);
  GPSsetup();
  setupUltra();
  setupBatteryReading();
  ss.begin(GPSBaud);
  setupTemp();
  setupWiFi();
  setupMotor();
}

void loop()
{
  ///// based on the current location, calculate the direction of travel and distance
  // if session is running
  // get current location, check ultrasonic sensors for objects, check distance from target
  // if distance is <2.5 meters of target, stop and record measurement
  // else -- calculate direction and turn to calculated angle
  // if <30 degrees offset, check ultrasonic sensors
  // if ultrasonic sensors are good, move forward
  // else, recalculate the angle until its good
  //
  // Wifi module -- send data variables e.g. location, current reading
  // check state -- session start/stop
  //
  double targetLat = 0; //...get from user via post request ******* TODO ****
  double targetLon = 0; //...get from user via post request
  double currentLat = getCurrentLat();
  double currentLon = getCurrentLon();
  if (currentLat == 911 || currentLon == 911)
  {
    ready = false; // prevents boat from moving until it has a valid GPS signal
    // send message to app session page... GPS signal not found
  }
  double targetBear = getBearing(currentLat, currentLon, targetLat, targetLon);

  loopBattery();
  loopUltra();
  loopTemp();
  loopWiFi();
  loopMotor();
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

// check for objects in the way -- set offset of sensors (left and right, front)

// correct direction for objects

// move forward

// move backward (for after running into something)

// turn to direction of travel
void turnToBearing(double targetBear)
{
  double currentBear = getCurrentBear();
  // turn until currentBear == targetBear
}

// send data
