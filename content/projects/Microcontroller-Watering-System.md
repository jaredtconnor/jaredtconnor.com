---
title: "Arduino Watering System"
repo: ""
tags: [microcontrollers, c++]
weight: 3
date: 2019-01-15
draft: true
---

Its not often that one gets to program with the physical world, but I must say, this project inspired a newfound appreciation for programming and electrical engineering. My brother has been playing around with Arduino controllers for a while now, so I piggy backed on his experience with them to create a project of my own: a self sustaining watering system for plants. 

Requirements: 

1. Arduino Uno: The flavor of microcontroller that you decide to go with is ultimately personal preference. My brother had an extra Uno laying around, so I asked if I could use that. 

2. Seesaw Capacitive Soil Sensor: In order to know when the soil requires water, we need a sensor to quantify the moisture level. There are two types of soil sensors available: 1) A capacitive moisture sensor which is what this project uses and a 2) resistive moisture sensor. 

3. A 12v pump: To eventually pump water to the plant, we need some kind of pump. I decided to go with a 12v pump to have the capacity to add more sensors for more pots or an entire planter watering system. Additionally, you could likely find a small pump that runs off the microcontroller's power, but we decided to go with a separate power supply which is switched via a relay.

4. A 5v Relay: Our pump is running off 5v power whereas the watering pump has auxilary power at 12v. In order to switch power to the pump on and off, we needed some kind of relay to control based on the reading from the soil sensor. 

#




