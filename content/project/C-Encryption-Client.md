---
title: "C Encryption Service"
date: 2022-06-17T08:13:24-07:00
description: 
tags: 
  - C
  - systems
  - encryption
draft: true
---

[Github](https://github.com/jaredtconnor/c-encryption-service) 

### Outline

1. Overview
2. Description of components
* Detail how to setup a server 
* Specify how to setup a server that accepts new connections via a new thread each time opposed to a single connection
* Specify the client and show how we can redirect
* Specify the key generation process
* Show how the server encrypts the messages sent
* Show how the decryption instances decrypt the messages received 
3. Illustrate Example
4. Learning Outcomes

## Overview 
This project served two main purposes. The first was to provide an example of TCP based communication with C through setting up a persistent multi-threaded server listening for clients. Secondly, the project also served as a gentle introduction to encryption services, specifically a [**One Time Pad**](https://en.wikipedia.org/wiki/One-time_pad) cipher for encryption. 

This was a projected completed during my time in [**Oregon State's Comp Sci Program**](https://eecs.oregonstate.edu/academic/online-cs-postbacc).

## Multi-Threaded Client/Server relationship
This project was part of an operating system's course, and I have to admit, socket connections in C were a bit clunky compared to higher level languages. 

For a server in C, we have to specify an address to listen on, bind the server to that address, then accept incoming connections from any clients that want to connect
