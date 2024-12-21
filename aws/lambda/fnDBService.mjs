import {fnDynamoSendQuery} from './fnDBRepo.mjs';
import {fnDateToIso,fnDatePlusDHM} from './fnDates.mjs';


export const fnDBFromToDateSkid = async (params_)=>{
    let params = {
        KeyConditionExpression: "pkid = :pkidv AND skid > :skidv",
        FilterExpression: "fromF = :fromFv AND toF = :toFv AND dateF = :dateFv",
        ExpressionAttributeValues: {
            ":pkidv":  "0" ,  // Partition key value
            ":skidv":  params_.skid ,  // Sort key value threshold
            ":fromFv":  params_.fromF ,  
            ":toFv":  params_.toF , 
            ":dateFv":  params_.dateF , 
        }
    };
    
    if(params_.limit)
        params.Limit = params_.limit;
    
    return await fnDynamoSendQuery(params);
    
    //return res.length ? res[0] : {};
};

export const fnDBLatestEmpty = async ()=>{
    
    let params = {
        KeyConditionExpression: "pkid = :pkidv AND skid > :skidv",
        ExpressionAttributeValues: {
            ":pkidv":  "0" ,  // Partition key value
            ":skidv":  fnDateToIso(fnDatePlusDHM(new Date(),0,2,-50))
        }
    };

    
    let result = await fnDynamoSendQuery(params);
    console.log("result38:",result);
    
    if(!result.length)
        return result;
    
    result = result.filter(item => item.done === 0);
    
    return result;
};