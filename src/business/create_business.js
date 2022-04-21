const AWS = require('aws-sdk');
const dynamo = AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async( event, context) => {

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({ message: "Successfully uploaded business" }),
    };

    let {
        id,
        name
    } = JSON.parse ( event.body );

    try{
        let params = {
            TableName : "BusinessTable",
            Item: {
                name
            }
        };

        await dynamo.put ( params ).promise();
        response.body= JSON.stringify( { message: "Successfully upload the business data"});
    }catch( error ){
        console.log( error );
        response.body = JSON.stringify( { message: "Failed to upload the business data",  error } );
    }

    return response;
}