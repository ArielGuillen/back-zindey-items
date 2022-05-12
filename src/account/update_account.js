const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

// Set the DynamoDB table name
const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async (event) => {
    
    //create the response object
    const response = {
        statusCode: 200,
        body: JSON.stringify({message : "Account updated successfully!"})
    };

    
    try{
        // Get and convert data from the body of the request
        const { Item } = JSON.parse(event.body);
        
        // Create an object with the DynamoDB parameters 
        // Item is the object to update
        const params = {
            TableName : TABLE_NAME,
            Item
        };
    
        const dynamoResponse = await dynamo.put( params ).promise();
        response.body = JSON.stringify( { 
            message: `Account ${Item.id} updated successfully`}, 
            dynamoResponse 
        );

    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to update account",
            error: error.message 
        });
    }
    
    return response;
};
