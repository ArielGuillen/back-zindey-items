const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async (event) => {
    const response  = await get_branches( event );
    return response;
}

async function get_branches(  event ){

    //create the response object
    let response = {
        statusCode: 200,
        body: JSON.stringify({message : "Get branches!"})
    };

    try{

        //Get the start key from the query params
        const querystring = event.queryStringParameters;
        const startKey = querystring.startKey;
        const limit = querystring.limit;
        
        //Create the object with the Dynamo params
        const branches = await dynamo.scan({
            TableName : TABLE_NAME,
            ExclusiveStartKey: {
                "id": startKey     
            },
            Limit: limit
        }).promise();

        let lastEvaluatedKey = "";
        if( branches.LastEvaluatedKey != null )
            lastEvaluatedKey = branches.LastEvaluatedKey;

        response.body = JSON.stringify({ 
            message: "Get branches list successfully", 
            count: branches.Count,
            lastEvaluatedKey,
            items: branches.Items
        });

    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to get branches", 
            error: error.message
        } );
    }
    
    return response;
}