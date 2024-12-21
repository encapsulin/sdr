source ./secrets_env.sh

url=$AWS_API_URL"&action=write&s=1"
echo $url

resp=$(curl $url)
echo $resp