const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler =  async ( event ) => {

    const TABLE_NAME = "BusinessTable";
    
    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({ message: "" }),
    };

    try{

        const businessItems = await dynamo.scan({ 
            TableName: TABLE_NAME
        }).promise();

        response.body = JSON.stringify( { 
            businessItems
        });

    } catch( error ){
        console.log( error );
        response.body = JSON.stringify( { message: "Failed to upload the business line data",  error } );
    }
    
    return response;
}