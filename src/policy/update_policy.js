const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async( event ) => {

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Update Policy' }),
    };
    
    try{

        //Get the BusinessLine id from the url params
        const id = event.pathParameters.id;

        let { name } = JSON.parse ( event.body );

        let params = {
            TableName : TABLE_NAME,
            Item: {
                id,
                name
            }
        };

        await dynamo.put ( params ).promise();
        response.body= JSON.stringify({ message: `Policy ${name} updated successfully` });

    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to update policy",
            error: error.message 
        } );
    }

    return response;
}