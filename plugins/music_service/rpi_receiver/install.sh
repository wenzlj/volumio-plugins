#!/bin/bash

echo "Installing rpi receiver Dependencies"
sudo apt-get update
# Install the required packages via apt-get
sudo apt-get -y install

#Setup script for rpi-Receiver (AM/FM radio)
echo "Setting up the AM/FM radio configuration"
setupScript.sh

# If you need to differentiate install for armhf and i386 you can get the variable like this
#DPKG_ARCH=`dpkg --print-architecture`
# Then use it to differentiate your install

#requred to end the plugin install
echo "rpi receiver installed"