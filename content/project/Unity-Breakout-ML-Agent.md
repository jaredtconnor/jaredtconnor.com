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

## Overview
[Github](https://github.com/Minkus-14/ML-Breakout) | [Demo](https://jaredtconnor.github.io/ML-Breakout/) | [Poster](/images/project_images/ml_breakout/ML-Breakout-Poster.pdf) | [Report](/images/project_images/ml_breakout/final-report.pdf)

[Atari Breakout](https://en.wikipedia.org/wiki/Breakout_(video_game)) was an arcade video game that was created by Steve Wozniak, Nolan Bushnell, and Steve Stristow back in 1976, along with Steve jobs developing the TTL chip for the prototype. 

This project was built in the [capstone course](https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=467&termcode=all) during my time at [**Oregon State's Comp Sci Program**](https://eecs.oregonstate.edu/academic/online-cs-postbacc). I was fortunate to work with [Ceci Fang](https://github.com/CcEeCcIi), [I-Chun Hurng](https://www.linkedin.com/in/ichunhurng/), and [Jacob Silverberg](https://www.linkedin.com/in/jacobsilverberg/) on this project as well. 

## Project Plan
To build the game, we used the [Unity game engine](https://en.wikipedia.org/wiki/Unity_(game_engine)), which was challenging at first. None of our team had prior experience developing games, let alone using Unity. So the first two weeks of the project were just gaining an understanding of how to build out the required game logic and structure of the game board. 

From the start, the team decided to break into groups with one group focusing on the development of the game logic while the other group researched how to train machine learning agents with Python and Unity. This allowed the game development team to have roughly a two-week head start to allow the ML Agent team to research how to structure the learning environment and integrate the changes. Our [initial plan](/files/ML_Breakout_Task.pdf) was fairly aggressive for an eight-week course, yet in hindsight, the aggressive development pace allowed for a lot of time towards the end to refine the project and test multiple training environments.
  
## Game Structure 
For a brief Unity crash course, within specific scenes, assets are defined and the physics and interactions are managed by attached [C#](https://docs.microsoft.com/en-us/archive/msdn-magazine/2014/august/unity-developing-your-first-game-with-unity-and-csharp) scripts. Ceci and Jake did a fantastic job at designing the overall game structure design along with the interactions between the paddle, ball, and brick objects. This logic included the [`gameManager`](https://github.com/Minkus-14/ML-Breakout/blob/main/Assets/Scripts/MainScripts/GameManager.cs) script, which defined the instantiation of the game objects. This also allowed for the creation and management of different [game states](https://www.youtube.com/watch?v=4I0vonyqMi8), from loading a level or populating the menu objects for a player to select. As shown below, the results allowed for a fairly simplistic use of game objects where the only required objects at the start of the game are the walls; everything else is a spawned object of a class or [prefab](https://docs.unity3d.com/Manual/Prefabs.html).

![game-board](/images/project_images/ml_breakout/game-board.png)  

## Reinforcement Learning

One of the main goals of the project was to serve as an introduction to [Reinforcement Learning](https://en.wikipedia.org/wiki/Reinforcement_learning), which is an area of machine learning that is concerned with how intelligent agents take actions in a controlled environment to maximize their reward function. 

![Reinforcement Learning](/images/project_images/ml_breakout/Reinforcement-Learning.png)

To develop the learning agents for a human player to compete against, we utilized the [`ML-Agents`](https://github.com/Unity-Technologies/ml-agents) Unity package. This allows developers a succinct manner to develop responsive and intelligent virtual players through a C# and Python SDK. The process to develop an agent begins with defining an agent object and appending it on a `Behavior Parameters` component and a `Decision Requester` component. Through the [`PlayerAgent`](https://github.com/Minkus-14/ML-Breakout/blob/main/Assets/Scripts/AgentScripts/PlayerAgent.cs) script, we can define the following interactions: 

- `OnEpisodeBegin()` - Defines what the agent will do before learning starts and sets the surrounding learning environment 

- `OnActionReceived()` - This collects actions that the agent can perform or possible instructions that can be provided to the agent to complete its specific goal. In our instance, we limit the possible actions to three possible actions, mainly to move left, move right, or stay at the current location.  

- `CollectObservations()` - This is the important method that specifies what metrics the agent will observe and begin to learn from. The team played with several possible observation combinations such as the distance from the agent to the ball, the current position of the agent (i.e. the paddle), along with the location and velocity of the ball. 

By defining the collection and interactions of what the agent observes and collects, we can then subsequently define the reward and penalty structure to provide a framework for the agent to learn from. To provide a positive reward, we can call the [`AddReward()`](https://github.com/Unity-Technologies/ml-agents/blob/release_19_docs/docs/Learning-Environment-Design-Agents.md#rewards) along with passing some scalar amount of reward to encourage the agent. Again, the team attempted several reward system structures, trying simplistic single rewards for every brick destroyed, rewarding the agent just for keeping the ball alive, along with the non-linear reward function illustrated below.

![Brick-Reward](/images/project_images/ml_breakout/brick_reward_function.png) 

The actual training and model development process to define a reinforcement learning algorithm and learning policy is fairly abstracted. The ML-Agents package utilizes [PyTorch](https://pytorch.org/) as the machine learning package and performs multiple *training episodes* the agent continues to optimize its current learning policy. 

{{< youtube id="8szEyjQc3zI" >}} 

To compare or view two agent brains, [stored](https://github.com/Minkus-14/ML-Breakout/tree/main/Assets/PlayerBrains) as `.onnx` files which can be used once trained within an agent component in Unity, one can view the learning policy results through [TensorBoard](https://github.com/Unity-Technologies/ml-agents/blob/release_19_docs/docs/Using-Tensorboard.md). Arguably the most improvement we could have made to the project is testing and optimizing the learning [configuration file](https://github.com/Unity-Technologies/ml-agents/blob/release_19_docs/docs/Training-Configuration-File.md) settings to better support learning efficiency and increase agent performance.  

![Learning-Reward-Graph](/images/project_images/ml_breakout/training-reward.png) 

Another approach to increase learning efficiency was to parallelize the training environment. This required making numerous duplicates of each learning environment resulting in multiple agents performing and learning at once, all accumulating to a combined policy.

{{< youtube id="fCwQFpH9X78" >}} 

We had mixed results with this but ultimately determined there were bugs within the game such as the ball flying outside of the game space or the agent *holding* onto the ball.  
 
## Learning Outcomes 
This project was challenging to complete within the short eight-week term mainly because of the amount of breadth that had to be covered. Unity and game development are challenging to understand and took a significant amount of time to grasp to a level to be efficient enough to develop the game. I greatly enjoyed working on the machine learning process, especially with how concise the ML-Agents package made everything to define a model, train, and display results. I've experienced the sheer amount of work that goes into developing and displaying model performance so I was pleased to see how fast one could iterate and stand up multiple models, which used drastically different methodologies. 
