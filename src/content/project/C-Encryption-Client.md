---
title: "C Encryption Service"
pubDate: 2022-03-02
description: "Multithreaded client/server service for encryption/decryption using One Time Pad cipher written in C"
tags: [C, systems, encryption]
draft: false
---

## Overview 
[Github](https://github.com/jaredtconnor/c-encryption-service) 

This project served two main purposes. The first was to provide an example of TCP-based communication with C through setting up a persistent multi-threaded server listening for clients. Secondly, the project also served as a gentle introduction to encryption services, specifically a [**One Time Pad**](https://en.wikipedia.org/wiki/One-time_pad) cipher for encryption. 

![Project-gif](/images/project_images/c-encryption-server/c-encryption-service.gif)

This was a project completed during my time in [**Oregon State's Comp Sci Program**](https://eecs.oregonstate.edu/academic/online-cs-postbacc).

## Understanding One Time Pad
The gist behind one-time pad ciphers is a randomly generated key that can be created that _must_ be longer than the message to be encrypted. This key is then used for a single time to adjust a plaintext message by first converting the characters to ASCII values and then subtracting/adding the pad to create a new randomized string. In theory, then the new ciphered text is not legible and can only be decrypted with the associated key. 

```text 
# Example from Wikipedia

      h       e       l       l       o  message
   7 (h)   4 (e)  11 (l)  11 (l)  14 (o) message
+ 23 (X)  12 (M)   2 (C)  10 (K)  11 (L) key
= 30      16      13      21      25     message + key
=  4 (E)  16 (Q)  13 (N)  21 (V)  25 (Z) (message + key) mod 26
      E       Q       N       V       Z  → ciphertext 
```
There are clear risks associated with these forms of ciphers:
1. The keys must be truly random, as opposed to pseudo-random, which is difficult 
2. Implied, the keys must only be used once and should not be used multiple times
3. If the key is obtained, access to the encrypted message is trivial 

If these risks are mitigated as best as possible, one should be able to trust the security of the ciphers to some extent. The security of the system is largely dependent on the implementation of the process.

## Key Generation 
A large component of this method of one-time pad ciphers is creating the actual key to be utilized. Note, I realize the simplistic approach with this pseudo-random number, further noted in the potential risks. To create the key, we can iterate through the length requirements specified by the module call, and create a random number:
```c
  // Populate the key
  for (int i = 0; i < keylen; i++)
  {
      int randnum = rand();
      char randchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ "[randnum % 27];
      fprintf(stdout, "%c", randchar);
  }

``` 

## Multi-Threaded Client/Server Relationship
C-based socket connections and TCP communication were utilized to implement the client/host capabilities to transfer and encrypt messages. I have to admit, socket connections in C were a bit clunky compared to higher-level languages, but nonetheless.

For a server in C, we have to specify an address to listen to, bind the server to that address, then accept incoming connections from any clients that want to connect. To allow multiple clients to connect to the same server, we can use process-oriented concurrent connections. So the server will listen on the `socket` we define, then fork each client making a request and encrypt and decrypt per each subprocess running.

```c 
  while (1)
  {
      // Accept the connection request which creates a connection socket
      newCon = accept(listenSocket, (struct sockaddr *)&clientAddress, &sizeOfClientInfo);

      if (newCon < 0)
      {
          error("ERROR on accept");
      }

      /* FORK: 
         forking the main process to allow for multiple children in a 
         concurrent manner
      */
      if ((con_pid = fork()) == 0)
      {
          
          // close initial listening socket
          close(listenSocket);

          /* 
          AUTH SECTION
          */
          connection_data.auth_len = recv(newCon, connection_data.auth, sizeof(AUTHLEN) - 1, 0);

          /* 
          Continues operations per each process...
          */ 
```

For the client, we can utilize the `socket()` then `connect()` method to connect to that socket and port we specify through the arguments passed:

```c
  // Create a socket
  socketFD = socket(AF_INET, SOCK_STREAM, 0);
  if (socketFD < 0)
  {
    error("CLIENT: ERROR opening socket");
  }

  // Set up the server address struct
  setupAddressStruct(&serverAddress, atoi(argv[3]), "localhost");

  // Connect to server
  if (connect(socketFD, (struct sockaddr *)&serverAddress, sizeof(serverAddress)) < 0)
  {
    error("CLIENT: ERROR connecting");
  }
``` 

Once the client has connected to the server, we can use a struct labeled `encrypt_data` to hold all of the relevant details needed which holds a `char[]` array for both the sent key and message to be encrypted. From there, we can follow the algorithm to encrypt the message by adding the pad to the message, specifically the ASCII value of both, then modulo by 27 to keep it within the ASCII range of alphabetical values.

```c 
for (int i = 0; i <= connection_data->data_len_read; i++)
  {
      if (connection_data->data[i] == 0)
      {
          continue;
      }

      data = deconvert(connection_data->data[i]);
      key = deconvert(connection_data->key[i]);

      cipher = (data + key) % 27;

      connection_data->cipher[i] = convert(cipher);
  }
``` 

Then this `cipher` array will hold the encrypted message. To reverse the process, we can take the same key, connect to the `dec_server`, and subtract the key from the `cipher` text, which should transform the message back into the readable format. 

## Learning Outcomes 
I enjoyed the service/client nature of this project. Writing web services in C is a bit much just given the complexity of [TCP Client/Server](https://www.geeksforgeeks.org/tcp-server-client-implementation-in-c/) requirements in C, so it probably would be easier to write this same implementation in Python or Node.js. I would also be wary of _how_ the data is encrypted and the security of a simplistic key/value pair. So there is still a lot to learn on how to truly secure messages/data at least taking concern for modern capabilities of encryption.

