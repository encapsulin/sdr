cd "$(dirname "$0")"
source secrets_env.sh

url=$AWS_API_URL"&action=read&s=1"
echo $url

resp=$(curl $url)
#resp='[{"ttl":1734849280,"s":"5","pkid":"0","done":0,"skid":"20241221_083440_666"}]'
echo $resp
