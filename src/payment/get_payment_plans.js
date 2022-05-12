const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async (event) => {

    //create the response object
    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Get payment plans successfully!" })
    };

    try {

        const { Items, Count } = dynamo.query({ TableName: TABLE_NAME }).promise();
        response.body = JSON.stringif({
            message: "Get Payment Plans list succesfully",
            Count,
            Items
        });

    } catch (error) {

        console.log(error);
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "Failed to get the payment plans list",
            error: error.message
        });

    }

    return response;
}

