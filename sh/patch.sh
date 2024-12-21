source ./secrets_env.sh

url=$AWS_API_URL"&action=patch&skid=20241221_073716_901&done=1"
echo $url

resp=$(curl $url)
echo $resp