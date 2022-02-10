// Senior Design Spr 2022 - Team NULL

// C libraries
#include <math.h>
#define PI 3.141592654

// L298N Motor driver pin setup
// **Sechamatics and Pin connections word doc
void setupMotor() {
  const int enA = 10;
  const int in1 = 9;
  const int in2 = 8;
  const int enB = 5;
  const int in3 = 7;
  const int in4 = 6;
}

// GPS pin setup

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
  
}

// calculate direction of travel
// argument units: degrees
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

// calculate distance to target

// check for objects in the way -- set offset of sensors (left and right, front)

// correct direction for objects

// move forward

// move backward (for after running into something)

// turn to direction of travel

// send data
