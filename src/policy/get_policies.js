const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async (event) => {
    const response  = await get_policies( event );
    return response;
}

async function get_policies(  event ){

    //create the response object
    let response = {
        statusCode: 200,
        body: JSON.stringify({message : "Get policies!"})
    };

    try{

        //Get the start key from the query params
        const querystring = event.queryStringParameters;
        const startKey = querystring.startKey;
        const limit = querystring.limit;
        
        //Create the object with the Dynamo params
        const policies = await dynamo.scan({
            TableName : TABLE_NAME,
            ExclusiveStartKey: {
                "id": startKey     
            },
            Limit: limit
        }).promise();

        let lastEvaluatedKey = "";
        if( policies.LastEvaluatedKey != null )
            lastEvaluatedKey = policies.LastEvaluatedKey;

        response.body = JSON.stringify({ 
            message: "Get policies list successfully", 
            count: policies.Count,
            lastEvaluatedKey,
            items: policies.Items
        });

    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to get policies", 
            error: error.message
        } );
    }
    
    return response;
}