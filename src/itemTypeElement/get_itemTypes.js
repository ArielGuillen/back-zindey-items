const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async (event) => {
    const response  = await get_item_types( event );
    return response;
}

async function get_item_types( event ){

    //create the response object
    const response = {
        statusCode: 200,
        isBase64Encoded: false,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        body: JSON.stringify( { message : "Get item types list" } )
    };

    try{        
        //Get the start key and limit from the query params
        const querystring = event.queryStringParameters;
        const startKey = querystring.startKey;
        const limit = querystring.limit;

        //Create the object with the Dynamo params
        let params;

        //If startkey is equals to 0 is the first scan and don't have a startkey
        if( startKey == '0' )
            params = {
                TableName : TABLE_NAME,
                Limit: limit
            };
        else
            params = {
                TableName : TABLE_NAME,
                ExclusiveStartKey: { "id": startKey },
                Limit: limit
            };
        
        const typesList = await dynamo.query( params ).promise();

        let lastEvaluatedKey = "";
        if( typesList.LastEvaluatedKey != null )
            lastEvaluatedKey = typesList.LastEvaluatedKey;

        response.body = JSON.stringify({ 
            message: "Get item types list successfully",
            count: typesList.Count,
            lastEvaluatedKey,
            items: typesList.Items
        });

    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to get item types list", 
            error: error.message 
        });
    }

    return response;
}
