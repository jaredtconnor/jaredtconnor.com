---
title: "Understanding Object Oriented Programming"
pubDate: 2019-01-05
tags: ["programming", "python"]
draft: false
---

# Classes and Programming Paradigms for Python
Programming paradigms, at least in my case of teaching myself programming, was something that I didn't stress but should have. While programming requires the use 
of writing code in a specific language's syntax, its more so a manner to distill a problem into a procedure to _attempt_ to arrive at a solution. All that said, these paradigms are different ways to solve problems. 

So, I assume we know about the normal data types available for Python, like floats, integers, strings, and lists. All of these are available to write programs that could reference string input from a file or numbers to represent the amount of sales in a specific month. 

But what if we were to try to represent a more complex _object_ that can't be distilled down to just a number or string. That's where these paradigms come into play. 

### Object Oriented and Procedural Programming
While Python was technically developed as a Object Oriented Programming (_OOP_) language, that still doesn't mean it's perfectly suitable for Procedural Programming situations. 

- Object Oriented Programming is an approach to model the world or a system by the it's main components. That is to say, it is a manner to break problems down into it's inter=connective components and the relations between those components. 

- Procedural Programming on the other hand is an approach to model a program down by a chronological recipe that arrives at a solution through a series of steps. 

### Classes in Python
Classes are used to provide user defined data structure to objects that other wise wouldn't be possible. For example, if we were going to represent a dog, it would be mighty difficult with simple data structures. By defining classes, we can provide our own defined structure to the object of a dog, and tack on specifications that we think will be important. So we could define the dogs `breed`, `hair length`, `bubbaness` within the class, then utilize that further on in our program.  
 
So how would we define a class: 

```python 
class Dog:
    
    species = "mammal"

    # Initialization and Attributes
    def __init__(self, name, breed, age):
        self.name = name
        self.breed = breed
        self.age = age 

cody = Dog("Cody", "Australian Shepard", 2)
boon = Dog("Boon", "Golden Retriever", 1)

print(f"{cody.name} is a {cody.breed}, and {boon.name} is a {boon.breed}")

```
Should yield us an output of: `Cody is a Australian Shepard, and Boon is a Golden Retriever`. 

Which is awesome! Let's tear this apart. The `__init__` function, specifically a method (a function within a class), automatically runs upon a class' initialization to populate the class with required information. Specifically for OOP, it is a [constructor](https://en.wikipedia.org/wiki/Constructor_(object-oriented_programming)). The `self` variable, while difficult to grasp a first, refers to the object itself, which can be assigned values and characteristics passed through upon initialization. 

A really important concept to remember here is the difference between a __class__ and a specific __instance__ of a class. That is a complicated concept but can be understood as a class is a generalization of our object where as a specific instance of our object is just that, a specific case. Basically, the difference is an idea of a dog (a class) and the cute Bubba (a specific instance of a dog).

To get a better idea of how we can reference the class, take this example: 

```python 

class Breeder: 

    # Initialization and Attributes 
    def __init__(self, name, location, breed_type):
        self.name = name
        self.location = location
        self.breed_type = breed_type

    # Example of passing self
    def description(self):
        return f"The {self.name} breeder, located in {self.location}, breeds {self.breed_type}"

    # Example of instance method
    def puppies_available(self, amount_of_puppies):
        return f"{self.name} has {amount_of_puppies} puppies available right now."


Golden_state_goldens = Breeder("Golden State Goldens", "California", "Golden Retrievers")

print(Golden_state_goldens.description)
print(puppies_available.puppies_available(10)

```
This yields us the result of: 

`The Golden State Goldens breeder, located in California, breeds Golden Retrievers` and `Golden State Goldens has 10 puppies available right now`. 

In general, the _self_ variable quite literally is referencing the specific instance. If we think of the class as a [factory](https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)) it helps make the idea of the _init_ and _self_ concepts a bit more clear. 


#### Modifying Classes

It also would be quite useful to modify an instance, such as this example: 

What the breeder we created sold one of it's really cute puppies? 

```python 

class Breeder: 

    def __init__(self, puppies_available): 
        self.puppies_available = puppies_available

    def sold_puppy(self):
        self.puppies_available -= 1

Ozzy_Aussies = Breeder(6)
Ozzy_Aussies.sold_puppy()
print(f"Puppies Available: {Ozzy_Aussies.puppies_available}")
```

Should output: `Puppies Available: 5`

#### Object Inheritance
The last important thing I discovered is object inheritance. This is the concept where you can have a specific _parent_ object, and further a _child_ object can inherit the attributes from the parent while also defining it's own attributes. 

For example: 
```python 

class Dog:
    species = "mammal"

    def __init__(self, name, age):
        self.name = name
        self.age = age

class Border_Collie(Dog):

    energy_level = "Extremely High"

Gus = Dog("Gus", 10)
Charlie = Border_Collie("Charlie", 1)

print(f"Charlies energy level: {Charlie.energy_level}")
print(f"What kind of species is Charlie: {Charlie.species}")
```

Should output: `Charlies energy level: Extremely High` and `What kind of species is Charlie: mammal`

Functionally, the `Dog` class specifies the parent class of a dog. Then the child class, my boy Charlie, inherits all the characteristics of a dog but also additional attributes specific to the child class `Border_Collie`. 

All of this should allow us to write programs and solutions to problems in blocks. I've ran into problems at work where writing a program in a procedural form is rather difficult because it requires you to break down the problem in sequential order. Sometimes procedures  might be great, especially things that follow a nice order (think of things like recipes). Yet classes and instances, more generally objects, allow us to easily solve problems that are dynamic and abstract in nature. I know I have a couple of scripts out there that are 500-750+ lines, which could easily be whittled down to a handful of modules that interact with each other. Adding this to my tool belt!
