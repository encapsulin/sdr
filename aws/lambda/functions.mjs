import {fnDynamoPut, fnDynamoScanFor, fnDynamoUpdate} from './fnDBRepo.mjs'            
import {fnDBFromToDateSkid,fnDBLatestEmpty} from './fnDBService.mjs'

export const fnIndex = async (params) => {
    console.log("fnIndex()",params)
    var response = {};

    if(params.pwd==='asdf'){

        if( params.s !== null && params.action==='write')  {
            response = await fnDynamoPut({"s":params.s,"done":0})
        }
        if(  params.action==='read')  {
            response = await fnDBLatestEmpty();
        }
        if(params.action === "PATCH"){
            response = await fnDynamoUpdate(params.skid,"set done = :x",{":x": 1});
        }

    } else 
        response = {"data":"wrong password"};

    console.log("response", response);
    console.log(JSON.stringify(response));
    return response;
};
