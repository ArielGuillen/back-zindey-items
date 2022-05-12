const AWS = require("aws-sdk");
//const s3 = new AWS.S3();
const dynamo = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async ( event ) => {

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({ message: "Create item" }),
    };

    try {

        //Transform the JSON string of body value to a javascript object
        let { 
            name,
            category, 
            price
        } = JSON.parse(event.body);
    
        const id = uuid.v4();

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
            message: "Created item successfully",
            id,
            name,
            price,
            category
        });
        
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.body = JSON.stringify({ 
            message: "Failed to upload Item", 
            error: error.message 
        });
    }
    return response;
}
