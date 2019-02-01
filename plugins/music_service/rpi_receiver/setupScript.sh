#!/bin/bash -

grep -Fq "rpi-Receiver" /volumio/app/plugins/system_controller/i2s_dacs/dacs.json
if [ $? -eq 0 ]
then
        echo string found
else
        echo string not found
        sed -i 's#{"name":"Raspberry PI","data":\[$#{"name":"Raspberry PI","data":[\n    {"id":"rpi-Receiver","name":"rpi Receiver","alsaname":"rpiReceiver","overlay":"rpi-receiver","alsanum":"1","mixer":"Master","modules":"","script":"","eeprom_name":["rpiReceiver"],"needsreboot":"yes"},#' /volumio/app/plugins/system_controller/i2s_dacs/dacs.json
        echo string inserted
fi
echo finished
