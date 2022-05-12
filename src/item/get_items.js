const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler =  async ( event ) => {
    
    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({ message: "GET Items list" }),
    };

    try{

        const items = await dynamo.scan({ 
            TableName: TABLE_NAME,
            Limit: 10
        }).promise();

        response.body = JSON.stringify( { 
            items,
            lastEvaluatedKey: items.LastEvaluatedKey
        });

    } catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to get items list",  
            error: error.message 
        } );
    }
    
    return response;
}