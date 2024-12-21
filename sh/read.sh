cd "$(dirname "$0")"
source ../secrets_env.sh

url=$AWS_API_URL"&action=read&s=1"
echo $url

resp=$(curl $url)
echo $resp
