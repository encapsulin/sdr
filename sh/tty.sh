#stty -F /dev/ttyUSB0 9600
stty -F /dev/ttyUSB0 9600 cs8 -cstopb -parenb
printf "5" > /dev/ttyUSB0