cd "$(dirname "$0")"

while true; do

    source ./read.sh
    seconds=$(echo $resp | sed 's/.*"s":"\([0-9]\)".*/\1/g')
    echo $seconds
    skid=$(echo $resp | jq -r '.[0].skid')
    echo "skid:" $skid
    if [ "$skid" != "null" ]; then
        sh ./patch.sh $skid
        sh ./tty.sh $seconds
    fi
    sleep 5

done

