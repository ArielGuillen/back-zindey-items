const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async (event) => {

    //create the response object
    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Payment plan added successfully!" })
    };

    try {
        
        //Get the body request
        const body = JSON.parse( event.body );
        let item;
        
        const dynamoParams = { 
            TableName: TABLE_NAME,
            Item: item
        };

        const dynamoResponse = dynamo.put( dynamoParams ).promise();
        response.body = JSON.stringif({
            message: "Payment plan added successfully",
            Count,
            Items
        });

    } catch (error) {

        console.log(error);
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "Failed to add the payment plan",
            error: error.message
        });

    }

    return response;
}

