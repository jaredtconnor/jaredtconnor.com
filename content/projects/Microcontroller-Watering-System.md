---
title: "Arduino Watering System"
repo: ""
tags: [microcontrollers, c++]
weight: 3
date: 2019-01-15
draft: true
---

![water testing](/images/project_images/arduino_project/full_build.jpg)

Its not often that one gets to program with the physical world, but I must say, this project sparked a newfound appreciation for programming. For a back story, my brother has been playing around with Arduino controllers for a while now. After a number of projects that blew my mind, I decided to piggy backed on his experience to create a project of my own; a self sustaining watering system for plants. During the summer months in Oregon, I've started to adore growing my own plants, specifically jade. The smell of a fresh jade plant in the early spring morning is something else. Creating a system that could sustainably water this plant seemed interesting, plus, there are a ton of examples online I could reference.

#### Research: 

There were a couple of different ways to build something like this and we discussed most of them. 

- A [gravity fed watering system](https://circuitdigest.com/microcontroller-projects/arduino-automatic-plant-watering-system) option to pump water into a single plant based. 
- A [sprinkler based system](https://www.instructables.com/id/Arduino-Automatic-Watering-System-For-Plants/) which is hilariously overkill.
- A [soaker hose watering system](https://www.youtube.com/watch?v=O_Q1WKCtWiA) based on temperature, UV, and soil moisture level sensors, though this is on the high end of what was needed.


I knew that I wanted to run the system of a pump to be able to scale out to a full planter in the future. You could go with a solenoid activated water value to plumb into a house's existing water fittings as seen in option 3 which, arguably could be where I take this into the future, but for now the pump will do just fine. With a pump based system, we can actively water the plant on an as needed bases, just by pumping water into the pot. 

#### Requirements: 

1. [Arduino Uno](https://store.arduino.cc/usa/arduino-uno-rev3): The flavor of micro controller you decide to go with is ultimately personal preference. My brother had an extra Uno laying around, so I used that.

2. [Seesaw Capacitive Soil Sensor](https://learn.adafruit.com/adafruit-stemma-soil-sensor-i2c-capacitive-moisture-sensor/python-circuitpython-test): In order to know when the soil requires water, we need a sensor to quantify the moisture level of the soil. There are two types of soil sensors available 1) a capacitive moisture sensor which senses the soil's ability to store an electrical charge and a 2) resistive moisture sensor which sends a current through the soil to view the level of resistance. After researching a number of projects, I've read that the resistive sensors are prone to corrosion, so I decided to utilize a capacitive sensor that utilizes the I2C protocol. I2C, a variant of data transfer protocol for controllers, is a commonly used As the [standard digital communications protocol](https://dronebotworkshop.com/i2c-arduino-arduino/) between controllers. There is more info [https://electrosome.com/interfacing-soil-moisture-sensor-arduino/](https://electrosome.com/interfacing-soil-moisture-sensor-arduino/) if you would like to build this off an analog system. 

3. A 12v pump: To eventually pump water to the plant, we need some kind of pump. I decided to go with a [Bayite 12v pump](https://www.amazon.com/gp/product/B074MZYS37/ref=ppx_yo_dt_b_asin_title_o07_s00?ie=UTF8&psc=1) to have the capacity to add more sensors for more pots or an entire planter watering system. Alternatively, you could likely find a small pump that runs off the micro controller's power, such as any [dosing pump](https://www.amazon.com/Gikfun-Peristaltic-Connector-Aquarium-Analytic/dp/B01IUVHB8E/ref=sr_1_9?keywords=5v+water+pump&qid=1580185420&sr=8-9, but we decided to go with a separate power supply which is switched via a relay.

4. A 5v Relay: Our pump is running off 5 volts power whereas the watering pump has auxiliary power at 12 volts. In order to switch power to the pump on and off, we need a relay to turn on and off based on the reading from the controller. This can be a confusing part so take note of the power systems that you have running off the controller. The actual board runs off 5 volts, the I2C soil sensor is running off 3.3 volts, and the watering pump is running of it's own 12 volt supply. 

#### Code:

The structure of this code is fairly simple. The top is setup to define all variables. 


```
#include "Adafruit_seesaw.h"

Adafruit_seesaw ss;

// Defining constant variables
const int pumpPin = 3;
const int ledPin = 12; 
const int moisture_level = 750; 

// Defining other variables
int pumpPower = LOW;    // Preset pump power to off
int ledPower = LOW;     // Preset LED power to off
long watering_time = 5000;    // amount of time pump will water (1 sec = 1000 ms)


void setup() {

  Serial.begin(115200);

  Serial.println("################### Soil Sensor v.2.0 ###################");

  // Deteched to see if soil sensor is available
  if (!ss.begin(0x36)) {
    Serial.println("ERROR! seesaw not found");
    while(1);
  } else {
    Serial.print("seesaw started! version: ");
    Serial.println(ss.getVersion(), HEX);
  }

  // Initializing Output Pins
  pinMode(pumpPin, OUTPUT);
  pinMode(ledPin, OUTPUT);

}


void loop() {

  // Read the capacitive soil sensor to get moisture reading (200: very dry | 2000: very wet)
  float tempC = ss.getTemp();
  uint16_t capread = ss.touchRead(0);

  // Printing out the current moisture
  Serial.print("Temperature: "); Serial.print(tempC); Serial.println("*C");
  Serial.print("Capacitive: "); 
  Serial.println(capread);

  // Specifying timer to run pump
  unsigned long currentMillis = millis(); 
  unsigned long previousMillis = 0; 


  // Conditional block to water the plant if the moisture level is too low
  if(capread <= moisture_level){
    Serial.println("Moisture below threshold");
    
      digitalWrite(pumpPin, HIGH);
      digitalWrite(ledPin, LOW);

      delay(5000);

      digitalWrite(pumpPin, LOW);
      digitalWrite(ledPin, HIGH);

     } else {
      digitalWrite(pumpPin, LOW);
      digitalWrite(ledPin, HIGH);
     }
 
  delay(300000); 
  // 5 Mins = 300000
}
```





