//fnDynamo.mjs
//import {fnSort} from './functionsFile.mjs'
import {fnDatePlusDHM,fnTtlMins,fnDateToIso} from './fnDates.mjs'


import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  QueryCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const tableName = 'tbSDR';

/////////////////////////////////////////////
export const fnDynamoPut = async (item) => {
    console.log("fnDynamoPut():",item);
    
    item.skid = fnDateToIso(fnDatePlusDHM(new Date(),0,2));
    item.pkid = "0";
    item.ttl = fnTtlMins(new Date(),60*24*1);

    // Define the parameters for the put operation
    const params = {
        TableName: tableName,
        Item: item
    };

    console.log(params);
    
    try {
        await dynamoDb.send(
          new PutCommand(params)
        );
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Item inserted: ' + item.skid})
        };
    } catch (error) {
        console.error('Error inserting item:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to insert item.', error: error.message })
        };
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////
export const fnDynamoScanFor = async (FilterExpression,ExpressionAttributeValues,limit) => {
    console.log("fnDynamoScanFor():")
     const params = {
        TableName: tableName,
        FilterExpression: FilterExpression
    };
    if(ExpressionAttributeValues)
        params.ExpressionAttributeValues = ExpressionAttributeValues;
    
    console.log(params);
    
    try {
        const result = await dynamoDb.send(new ScanCommand(params));
        console.log('Items:', result.Items);
        //let items = fnSort(result.Items)
             let items =  result.Items.sort((a, b) => {
                return b.skid.localeCompare(a.skid);
            });
      
        if(items.length > 0 && limit===1)
            return items.slice(0,limit)[0];
        else if(items.length > 0 && limit > 1)
            return items.slice(0,limit);
        else
            return items;
        
    } catch (error) {
        console.error('Error scanning table:', error);
    }
}
  
///////////////////////////////////////////////////////////////////////////////////////////
export const fnDynamoUpdate = async (id, UpdateExpression,ExpressionAttributeValues) => {
    console.log(fnDynamoUpdate);
    
    const params = {
        TableName: tableName,
      //  Key: { id: id }, 
        Key: {
        pkid: "0", // Change 'PK' to your actual partition key name
        skid: id // Add this if you have a sort key, change 'SK' to your actual sort key name
    },
        UpdateExpression: UpdateExpression,
        ExpressionAttributeValues:         ExpressionAttributeValues,
        ReturnValues: "UPDATED_NEW" // Returns the updated attributes
    };

    console.log(params);
    
    try {
        // Perform the update operation
        const result = await dynamoDb.send(new UpdateCommand(params));
        console.log('Update successful:', result);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Field updated', updatedAttributes: result.Attributes })
        };
    } catch (error) {
        console.error('Error updating item:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to update item.', error: error.message })
        };
    }
};


// export const queryMostRecentItem = async () => {
//     // Define the query parameters
//     const params = {
//         TableName: tableName, // Use the tableName variable here
//       KeyConditionExpression: "pkid = :pkid AND id = :id",
//     ExpressionAttributeValues: {
//         ":pkid": { S: "0" }, // Replace with your actual pkid value
//         ":skid": { S: "20240831_210250_055" } // Replace with your actual id value
//     },
//         ScanIndexForward: false, // False to get items in descending order
//         Limit: 1 // Limit to 1 result
//     };

//     try {
//         // Execute the query
//         const data = await dynamoDb.send(new QueryCommand(params));
//         console.log("Query successful:", data.Items);

//         return {
//             statusCode: 200,
//             body: JSON.stringify(data.Items) // Return the most recent item
//         };
//     } catch (error) {
//         console.error("Error querying items:", error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ message: "Failed to query items.", error: error.message })
//         };
//     }
// };

// Example usage: querying for the most recent item with id greater than a certain threshold
// queryMostRecentItem("PK_12345", "ID_2024_08_31").then((response) => { // Replace with your pkid and id threshold
//     console.log("Response:", response);
// });
// Create DynamoDB document client

export const queryDynamoDbExample = async () => {
    const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression:
      "pkid = :pkidv AND skid > :skidv",
    ExpressionAttributeValues: {
      ":pkidv": "0",
      ":skidv": "0",
    },
    ConsistentRead: true,
    ScanIndexForward: false, // Orders results in descending order by `skid`
    Limit: 1, // Limit the response to the latest item

  });
    
 const response = await dynamoDb.send(command);
  return response.Items;

};

////////////////////////////////////////////////
export const fnDynamoSend = async (command) => {
    try {
        console.log("fnDynamoSend()");
        const response = await dynamoDb.send(command);
        console.log("Query OK:", response);
        return response.Items;
    } catch (error) {
        console.error("Query Error:", error);
        throw error;
    } finally {
        //console.log("asdf 41");
    }
};

/////////////////////////////////////////////////
export const fnDynamoSendQuery = async (params) => {
    params.TableName=tableName;
    params.ScanIndexForward= false;
    console.log("fnDynamoSendQuery():",params);
    const command = new QueryCommand(params);
    const data = await fnDynamoSend(command);
    console.log("asdf3 data:",data);
    return data;
    
};
