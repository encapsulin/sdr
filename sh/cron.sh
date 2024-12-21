cd "$(dirname "$0")"

source ./read.sh
#resp='[{"ttl":1734847341,"s":"2","pkid":"0",'
seconds=$(echo $resp | sed 's/.*"s":"\([0-9]\)".*/\1/g')
echo $seconds