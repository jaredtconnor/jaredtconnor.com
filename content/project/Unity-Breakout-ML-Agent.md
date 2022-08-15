---
title: "Unity Breakout Game"
date: 2022-08-05
description: Atari Breakout clone built in Unity using reinforcement Learning for the computer agent
tags: 
  - Unity
  - Game Development
  - Machine Learning
draft: true
---

### Outline

1) Introduction
  - Introduce team members 
  - Describe group requirements 

2) Discuss project plan 
  - Show project plan
  - Discuss group decisions

3) Discuss game structure and unity development

4) Discuss ml-agent structure 

5) Discuss training runs and struggles

6) Show game and example

6) Discuss Learning Outcomes


## Overview
[Github](https://github.com/Minkus-14/ML-Breakout)

This project was built during the [capstone course](https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=467&termcode=all) in part my time at [**Oregon State's Comp Sci Program**](https://eecs.oregonstate.edu/academic/online-cs-postbacc). I was fortunate to work with [Ceci Fang](https://github.com/CcEeCcIi), [I-Chun Hurng](https://www.linkedin.com/in/ichunhurng/), and [Jacob Silverberg](https://www.linkedin.com/in/jacobsilverberg/) on this project as well. 

[Atari Breakout](https://en.wikipedia.org/wiki/Breakout_(video_game) was a arcade video game that was originally created by Steve Wozniak, Nolan Bushnell, and Steve Stristow back in 1976, along with Steve jobs developing the TTL chip for the prototype.

## Project Plan
To build the game, we were required to the the [Unity game engine](https://en.wikipedia.org/wiki/Unity_(game_engine)) for development, which was challenging at first. None of our team had prior experience developing games, let alone using Unity, so the first two weeks of the project was just understanding how to build out the required game logic and structure of the gameboard. 

From the start, the team decided to break into groups with one group focusing on the development of the game logic while the other group researched how to train machine learning agents with Python and Unity. This allowed the game development team to have roughly a two week head start so the ML Agent team could research how to structure the learning environment and integrate the changes. Our [initial plan](/files/ML_Breakout_Task.pdf) was fairly aggressive for an eight week course yet in hindsight, was wonderful because we had a lot of time towards the end to refine the project and test multiple training environments.
  
## Game Structure 
For a brief Unity crash course, within specific scenes, assets are defined and the physics and interactions are managed by attached [C#](https://docs.microsoft.com/en-us/archive/msdn-magazine/2014/august/unity-developing-your-first-game-with-unity-and-csharp) scripts. Ceci and Jake did a fantastic job at designing the overall game structure design along with the interactions between the paddle, ball and brick objects. This included the [`gameManager`](https://github.com/Minkus-14/ML-Breakout/blob/main/Assets/Scripts/MainScripts/GameManager.cs) script, which defined the instantiation of the game objects. This allowed for the creation and management of different game states, from loading a level to instantiating game objects such as the ball and bricks. As shown below, this allowed for a fairly simplistic use of game objects where the only required objects at the start of the game are the walls; eveything else is a spawned object of a class or [prefab](https://docs.unity3d.com/Manual/Prefabs.html).

![game-board](/images/project_images/ml_breakout/game-board.png) 


## Machine Learning

![learning-image](/images/project_images/ml_breakout/learning.png)


