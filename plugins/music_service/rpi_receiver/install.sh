#!/bin/bash

echo "Installing rpi receiver Dependencies"
sudo apt-get update
# Install the required packages via apt-get
sudo apt-get -y install

# If you need to differentiate install for armhf and i386 you can get the variable like this
#DPKG_ARCH=`dpkg --print-architecture`
# Then use it to differentiate your install

#requred to end the plugin install
echo "rpi receiver installed"

#Setup script for rpi-Receiver (AM/FM radio)
ORIGINAL='  {"name":"Raspberry PI","data":\[$'
NEW='  {"name":"Raspberry PI","data":[\n    {"id":"rpi-Receiver","name":"rpi Re$
FILE=/volumio/app/plugins/system_controller/i2s_dacs/dacs.json

grep '"id":"rpi-Receiver"' $FILE >/dev/null 2>&1
if [ $? -eq 1 ]
then
  sed -i -e "s/${ORIGINAL}/${NEW}/g" $FILE
fi


alsaloop -C hw:rpiReceiver,1 -P hw:rpiReceiver,0 -d
