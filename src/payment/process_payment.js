const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async (event) => {

    //create the response object
    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Payment processed successfully!" })
    };

    try {
        //Get the body request
        const body = JSON.parse( event.body );

        const dynamoParams = { 
            TableName: TABLE_NAME
        };

        const dynamoResponse = dynamo.query( dynamoParams ).promise();
        response.body = JSON.stringif({
            message: "Payment processed successfully",
            dynamoResponse
        });

    } catch (error) {

        console.log(error);
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "Failed to process the payment",
            error: error.message
        });

    }

    return response;
}

