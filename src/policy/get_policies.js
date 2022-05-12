const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.getAllItemsHandler = async (event) => {

    //create the response object
    const response = {
        statusCode: 200,
        body: JSON.stringify({message : "Get policies!"})
    };

    try{
         //Create the object with the Dynamo params
        var params = {
            TableName : TABLE_NAME,
            Limit: 10
        };
        const policies = await dynamo.scan(params).promise();
        
        response.body = JSON.stringify({ 
            message: "Get policies list successfully", 
            policies,
            lastEvaluatedKey: policies.LastEvaluatedKey
        });

    }catch( error ){
        console.log( error );
        response.body = JSON.stringify( { 
            message: "Failed to get policies", 
            error: error.message
        } );
    }

    return response;
}
