const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

//Get the DynamoDB table name
const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async (event) => {

    //create the response object
    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Account created successfully!" })
    };
    
    try {
        // Get and convert data from the body request
        const { id, type } = JSON.parse(event.body);
              
        // Create an object with the DynamoDB parameters 
        // Item is the data for the new object
        const params = {
            TableName: TABLE_NAME,
            Item: {
                id,
                type,
                status: 'Status.inactive'
            }
        };

        dynamoResponse = await dynamo.put(params).promise();
        response.body = JSON.stringify({ 
            message: `Account ${id} created successfully` }, 
            dynamoResponse
        );

    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.body = JSON.stringify({ 
            message: "Failed to create account" , 
            error: error.message 
        });
    }

    return response;
};
