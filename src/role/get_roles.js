const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async (event) => {

    //create the response object
    const response = {
        statusCode: 200,
        body: JSON.stringify({message : "Get role list successfully!"})
    };

    try{
        //Get the key to start the scan from the url params
        const startKey = event.pathParameters.startKey;

        //Create the object with the Dynamo params
        const params = {
            TableName : TABLE_NAME,
            ExclusiveStartKey: {
                "id": startKey     
            },
            Limit: 5
        };
         
        const data = await dynamo.scan(params).promise();
        response.body = JSON.stringify({ 
            message: "Get Role List Successfully", 
            lastEvaluatedKey: data.LastEvaluatedKey,
            items: data.Items
        });

    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to get roles", 
            error: error.message 
        });
    }

    return response;
}
