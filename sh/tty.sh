#stty -F /dev/ttyUSB0 9600  crtscts cs8 -cstopb -parenb
sec=$1
stty -F /dev/ttyUSB0 9600 
echo -n "$sec" > /dev/ttyUSB0