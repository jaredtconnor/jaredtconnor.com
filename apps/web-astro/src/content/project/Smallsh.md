---
title: 'Smallsh'
pubDate: 2022-02-15
description: 'Linux based shell program illustrating process API in C'
tags: [C, systems]
draft: false
---

## Overview

[Github](https://github.com/jaredtconnor/smallsh)

This project was challenging but ultimately rewarding. Like some of my previous work thus far, I developed this while attending [Oregon State's](https://eecs.oregonstate.edu/academic/online-cs-postbacc) Computer Science program during my [Operating Systems](https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=344&termcode=all) course.

![Smallsh](/images/project_images/smallsh_project/smallsh.gif)

First a note about these classes of projects. Many university computer science programs request students to write a minimal C shell. [Stephen Brennan](https://brennan.io/) has a good comment [here](https://brennan.io/2016/03/29/dishonesty/) discouraging academic dishonesty. Also, Stephen's original [post](https://brennan.io/2014/01/16/write-a-shell-in-c/) on the details of writing a basic Unix-based shell is a wonderful starting point and I would recommend reading the article if you have a chance.

A [shell](<https://en.wikipedia.org/wiki/Shell_(computing)>) is command line interpreter that provides a user interface to execute and manipulate the operating system for a Unix-based system (though Windows-based machines have similar interfaces). This project provides a great starting point to understand how processes and executables run at the systems level. Conceptually, this is a great introduction to [POSIXbased process APIs](https://www.ibm.com/docs/en/ztpf/2020?topic=system-posix-compliant-apis-process-control) to manage and access the underlying processes being executable by the operating system.

Conceptually, the required life cycle of a shell is fairly minimal, all things considered:

1. Read in inputs from the user - To understand what processes and executables to run, we must correctly parse and read commands along with additional passed arguments from the user, or `stdin` input
2. Execute the commands - Once we know what and how to execute commands, the shell must correctly determine if the command should be executed in the background or foreground and call the corresponding binary executable
3. Exit when prompted and clean up processes - If there are commands that take a while to execute or thing is still being executed in the background so the parent processes do not close before all children are complete, resulting in [zombie](https://en.wikipedia.org/wiki/Zombie_process) processes, ultimately erroneously using CPU resources

To read in the inputs and correctly parse the arguments, comments, and redirection inputs/outputs, I opted to use a linked list of `argnode` struct types. The specifications and list manipulation functions can be found in the [`arlist.c`](https://github.com/jaredtconnor/smallsh/blob/main/arglist.c) implementation file.

```C
struct argnode_t {
    char * value;
    struct argnode_t * next;
};


struct arglist_t {
    int size;
    struct argnode_t * head;
    struct argnode_t * tail;
};
```

Once the command parsing and all inputs are correctly handled by way of the `arglist`, we can follow the basic `while` loop running on a `std_bool` variable for `shell_running`. The functionality then follows the main structures required within a shell - awaiting commands and correctly parsing them, executing the built-in commands, and then executing any other generic Unix-based commands.

The built-in commands for this basic shell are:

- [`cd`](https://github.com/jaredtconnor/smallsh/blob/9efb6e1f256dc189f080dfe5d2968f080129c949/smallsh.c#L355) - Changes the current working directory given the first argument utilizing the C standard [`chdir`](https://linux.die.net/man/3/chdir) command
- [`status`](https://github.com/jaredtconnor/smallsh/blob/9efb6e1f256dc189f080dfe5d2968f080129c949/smallsh.c#L367) - Displays the exit status of, if any, any commands executed in the background utilizing the `&` suffix utilizing the [`WEXITSTATUS`](https://www.ibm.com/docs/en/ztpf/1.1.0.15?topic=apis-wexitstatusobtain-exit-status-child-process) macro
- [`exit`](https://github.com/jaredtconnor/smallsh/blob/9efb6e1f256dc189f080dfe5d2968f080129c949/main.c#L39) - Specifies to the main shell loop to no longer accept user input and [`wait()`](https://www.ibm.com/docs/en/i/7.3?topic=ssw_ibm_i_73/apis/wait.htm) to close any background processes and existing child processes

These commands are accessible and don't require the use of a users `/bin` directory. Other commands are handled by the [`execp()`](https://www.journaldev.com/40793/execvp-function-c-plus-plus) function within the [`execute_foreground()`](https://github.com/jaredtconnor/smallsh/blob/9efb6e1f256dc189f080dfe5d2968f080129c949/smallsh.c#L485) method. The `exec` family of functions replaces the current running processes with a new process that we specify as a `*file` pointer to a binary executable or shell script. Note that the specific location of the executable being called must be within the `PATH`. This allows us to run nearly any program we have installed, such as `nvim` to kick off Neovim or `ls`, or `pwd`.

```C
  // main shell process
  while (shell_running) {

      // parse arguments
      command_data = parse_arguments(command);

      // skip if comment
      if (command_data->is_comment == true) {
          command = read_input();
          continue;
      }

      // exit shell and kill child processes
      else if (command_data->exit == true) {
          shell_running = false;
      }

      // execute built in commands - TODO
      else if (command_data->builtin == true) {
          execute_built_in_command(command_data, &status);
      }

      // execute other commands
      else {
          execute_fork(command_data, &status, &SIGINT_action);
      }

      // prints current background processes
      background_process_status();

      // re-read command input
      if (shell_running) {
          command = read_input();
      }

  }

  //free(command_data);
  destroy_list(command_data->arguments);
  free(command_data);

```

## Possible Improvements

This is still a pretty basic Unix shell. We could expand this to read in implementation files or configuration files. For example, if we look at [iTerm2's](https://github.com/gnachman/iTerm2) source code, granted this project is in Objective-C, we can expand the complexity fairly significantly.

## Learning Outcomes

Overall though, even while being pretty simple, this project illustrates that even making a pretty complex Unix shell is doable once you understand the basics! Some key concepts I kept with:

1. [Version control](https://github.com/jaredtconnor/smallsh/commits/main?before=9efb6e1f256dc189f080dfe5d2968f080129c949+35&branch=main) is your friend. I was struggling originally with how to implement this and meet all of the requirements. After stepping back and viewing the project, it's possible to break the project down into sections and push changes in bulk once a module/section/functionality is built out.
2. Design matters - With this, I mean that how you decide to design the data structures and functionality has drastic impacts on how complex the modules of code will be. The course had fairly restrictive requirements regarding libraries you can use and specifications, but moving to a linked list for the arguments helped to abstract the need to religiously manage a _n_ length buffer, though downsides likely are more memory management risks.
