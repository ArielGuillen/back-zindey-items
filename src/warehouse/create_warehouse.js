const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

exports.lambdaHandler = async( event ) => {

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({ message: "Successfully uploaded warehouse data" }),
    };

    let {
        name
    } = JSON.parse ( event.body );

    const id = uuid.v4();
    
    try{
        let params = {
            TableName : "WarehouseTable",
            Item: {
                id,
                name
            }
        };

        await dynamo.put ( params ).promise();
        response.body= JSON.stringify( { message: "Successfully upload the warehouse data"});
        
    }catch( error ){
        console.log( error );
        response.body = JSON.stringify( { message: "Failed to upload the warehouse data",  error } );
    }

    return response;
}