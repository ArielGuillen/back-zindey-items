const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async( event ) => {

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({ message: "Successfully updated warehouse data" }),
    };
    
    //Get the warehouse id from the url params
    const id = event.pathParameters.id;

    let {
        name
    } = JSON.parse ( event.body );
    
    try{
        let params = {
            TableName : "WarehouseTable",
            Item: {
                id,
                name
            }
        };

        await dynamo.put ( params ).promise();
        response.body= JSON.stringify( { message: "Successfully updated the warehouse data"});
        
    }catch( error ){
        console.log( error );
        response.body = JSON.stringify( { message: "Failed to update the warehouse data",  error } );
    }

    return response;
}