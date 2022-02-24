// Senior Design Spr 2022 - Team NULL

// C libraries
#include <math.h> // built-in
#include <TinyGPSPlus.h> // installed
#include <SoftwareSerial.h> // built-in

#define PI 3.141592654

// L293D Motor driver pin setup
const int motor1pin1 = 5;
const int motor1pin2 = 6;
const int motor2pin1 = 9;
const int motor2pin2 = 8;
  
void setupMotor() {
  pinMode(motor1pin1, OUTPUT);
  pinMode(motor1pin2, OUTPUT);
  pinMode(motor2pin1, OUTPUT);
  pinMode(motor2pin2, OUTPUT);
}

// GPS setup
static const int RXPin = 4, TXPin = 3;
static const uint32_t GPSBaud = 9600;
TinyGPSPlus gps;
SoftwareSerial ss(RXPin, TXPin);

// Sensor1 pin setup

// Wifi module pin setup

  // hotspot setup for wifi module

// Calculate battery level

// Ultrasonic sensor pin setup

////// Boat variables //////
// boat state
// boat speed
// boat location (coordinates)
// boat battery level
// target location (coordinates)
// sensor1 measurement
// current time/time of measurement ??
// current direction/heading (via magnetometer)
// target direction/heading (via calculation)




void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  setupMotor();
  ss.begin(GPSBaud);
}

void loop() {
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

// calculate direction of travel in degrees (arg units -- degrees)
double getBearing(double currentLat, double currentLon, double targetLat, double targetLon) {
  currentLat = currentLat * PI/180; // convert to radians
  currentLon = currentLon * PI/180;
  targetLat = targetLat * PI/180;
  targetLon = targetLon * PI/180;
  double x = cos(targetLat) * sin(targetLon-currentLon);
  double y = (cos(currentLat) * sin(targetLat)) - (sin(currentLat) * cos(targetLat) * cos(targetLon-currentLon));
  double b = atan2(x,y) * 180 / PI; // convert back to degrees
  return b;
}

// calculate distance to target in meters
double getDistance(double currentLat, double currentLon, double targetLat, double targetLon) {
  currentLat = currentLat * PI/180; // convert to radians
  currentLon = currentLon * PI/180;
  targetLat = targetLat * PI/180;
  targetLon = targetLon * PI/180;
  double deltaLat = targetLat - currentLat;
  double deltaLon = targetLon - currentLon;
  double a = pow(sin(deltaLat/2),2) + (cos(currentLat) * cos(targetLat) * pow(sin(deltaLon/2),2));
  double c = 2 * atan2(sqrt(a),sqrt(1-a));
  double d = c * 6371000;
  return d;
}

double getCurrentLat() {
  if (gps.location.isValid()) {
    return gps.location.lat();
  }
  else {
    return 911; // invalid reading - if lat or lng = 911 halt the boat
  }
}

double getCurrentLon() {
  if (gps.location.isValid()) {
    return gps.location.lng();
  }
  else {
    return 911; // invalid reading
  }
}

// check for objects in the way -- set offset of sensors (left and right, front)

// correct direction for objects

// move forward

// move backward (for after running into something)

// turn to direction of travel

// send data
