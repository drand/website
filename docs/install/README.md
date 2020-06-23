---
title: Install
---

# Install

The easiest way to install drand is to use the [official binaries](#official-release). If you'd prefer, you can manually install the project using [Golang](/install/golang). If you are installing drand in a production server environment, use [Docker](/install/docker).

| [Linux](#linux) | [macOS](#macos) | [Raspberry Pi](#raspberry-pi) |
| --- | --- | --- |
| [![Linux icon.](./images/install/linux-icon.png)](#linux) | [![macOS icon.](./images/install/apple-icon.png)](#macos) | [![Raspberry Pi icon.](./images/install/raspberry-pi-icon.png)](#raspberry-pi) |

## Linux

In this install we're going to download the latest binary for our system, extract the `.tar` file, move the `drand` executable to a convient location, add `drand` to our PATH, and finally test the installation.

1. Download the latest release from the [drand GitHub releases page](https://github.com/drand/drand/releases):

   ```bash
   wget https://github.com/drand/drand/releases/download/v0.9.1/drand_0.9.1_Linux_x86_64.tar.gz
   ```

   If you are using a 32-bit system, download the `i386.tar.gz` release.

1. Make a directory called `drand` and extract the archive into there:

   ```bash
   mkdir ~/drand && tar -xvzf drand_0.9.1_Linux_x86_64.tar.gz -C ~/drand
   ```

1. Add `drand` to your PATH:

   ```bash
   echo '# Add drand to PATH' >> ~/.profile && echo 'export PATH=$PATH:~/drand' >> ~/.profile && source ~/.profile
   ```

1. Test that everything's working fine:

   ```bash
   drand

   > NAME:
   > drand - distributed randomness service
   >
   > USAGE:
   >    drand [global options] command [command options] [arguments...]
   > ...
   ```

## macOS

In this install we're going to download the latest binary for our system, extract the `.tar` file, move the `drand` executable to a convient location, add `drand` to our PATH, and finally test the installation.

1. Download the latest release from the [drand GitHub releases page](https://github.com/drand/drand/releases):

   ```bash
   wget https://github.com/drand/drand/releases/download/v0.9.1/drand_0.9.1_Darwin_x86_64.tar.gz
   ```

   If you are using a 32-bit system, download the `i386.tar.gz` release.

1. Extract the archive:

   ```bash
   tar -xvzf drand_0.9.1_Darwin_x86_64.tar.gz -C ~/drand
   ```

1. Add `drand` to your PATH:

   ```bash
   echo '# Add drand to PATH' >> ~/.profile && echo 'export PATH=$PATH:~/drand' >> ~/.profile && source ~/.profile
   ```

1. Test that everything's working fine:

   ```bash
   drand

   > NAME:
   > drand - distributed randomness service
   >
   > USAGE:
   >    drand [global options] command [command options] [arguments...]
   > ...
   ```

## Raspberry Pi
