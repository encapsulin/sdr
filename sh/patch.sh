source ./secrets_env.sh

skid=$1
url=$AWS_API_URL"&action=patch&skid="$skid"&done=1"
echo $url

resp=$(curl $url)
echo $resp