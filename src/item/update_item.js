const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async ( event ) => {

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({ message: "Update item" }),
    };    

    try {
        
        //Get the id from the url params
        const id = event.pathParameters.id;
    
        //Transform the JSON string of body value to a javascript object
        let { 
            name,
            price,
            category
        } = JSON.parse(event.body);

        await dynamo.put({
            TableName: TABLE_NAME,
            Item: {
                id,
                name,
                price,
                category
            }
        }).promise();
        
        response.body = JSON.stringify({ 
            message: 'Item updated successfully',
            id,
            name,
            price,
            category
        });
        
    } catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to update item",  
            error: error.message 
        } );
    }
    return response;
}
