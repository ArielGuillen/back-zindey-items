const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async( event ) => {

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({ message: "Successfully uploaded businessLine data" }),
    };
    
    //Get the BusinessLine id from the url params
    const id = event.pathParameters.id;

    let {
        name
    } = JSON.parse ( event.body );
    
    try{
        let params = {
            TableName : "BusinessLineTable",
            Item: {
                id,
                name
            }
        };

        await dynamo.put ( params ).promise();
        response.body= JSON.stringify( { message: "Successfully upload the business line data"});
        
    }catch( error ){
        console.log( error );
        response.body = JSON.stringify( { message: "Failed to upload the business line data",  error } );
    }

    return response;
}