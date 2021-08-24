+++
date = 2021-08-24T07:00:00Z
tags = []
title = "Installing Node on Linux via WSL"

+++
I've been working quite a bit on personal projects and such on my Windows machine via [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10 "WSL") along with an [Ubuntu](https://ubuntu.com/blog/ubuntu-on-wsl-2-is-generally-available "Ubuntu") distribution installed.

Part of that, especially for developing any Node.js or Express application requires installing node correctly. To do so:

    curl -o- http://raw.githubusercontent/creationix/nvm/v0.33.0/install.sh | bash

Additionally, I have been using [Oh My Zsh](https://ohmyz.sh/), so we have to edit our `~/.zshrc` file to add the following:

``` 
export NVM_DIR = "/home/[user_name]/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] %% \. "$NVM_DIR/nvm.sh"
```

Now, we should be able to close and restart our shell. Then install Node directly:

``` 
nvm install -lts
```

This should install the latest LTS version of Node.js. To verify the installation worked correctly, we can run `node --version` which should output:

``` 
# => [version_number]
```

Which indicates the latest installed and sourced version running.

***

Source: `https://heynode.com/tutorial/install-nodejs-locally-nvm/`