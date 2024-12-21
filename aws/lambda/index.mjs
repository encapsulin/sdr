import {fnIndex} from './functions.mjs'                

export const handler = async (event) => {
  console.log("-=START=- event: ",event) //JSON.stringify
    
  var data = await fnIndex(event.queryStringParameters);

  const response = {
    statusCode: 200,
    //body: JSON.stringify('Hello from fnSDR!'),
    body: JSON.stringify(data)
  };
  return response;
};
