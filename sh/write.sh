cd "$(dirname "$0")"
source ./secrets_env.sh

url=$AWS_API_URL"&action=write&s=5"
echo $url

resp=$(curl $url)
echo $resp