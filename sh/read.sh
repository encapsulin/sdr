source ../secrets_env.sh

url="https://045bw4qb8k.execute-api.us-east-1.amazonaws.com/fnSDR?action=read&pwd="$AWS_CURL_PWD"&s=1
echo $url