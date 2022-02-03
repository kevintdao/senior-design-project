// Senior Design Spr 2022 - Team NULL

// Motor driver pin setup

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




void setup() {
  // put your setup code here, to run once:

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

// calculate distance to target

// check for objects in the way -- set offset of sensors (left and right, front)

// correct direction for objects

// move forward

// move backward (for after running into something)

// turn to direction of travel

// send data
