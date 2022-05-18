const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async (event) => {
    const response  = await get_roles( event );
    return response;
}


async function get_roles( event ){

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
            Limit: 10
        };
         
        const roles = await dynamo.scan(params).promise();
        
        let lastEvaluatedKey = "";
        if( roles.LastEvaluatedKey != null )
            lastEvaluatedKey = policies.LastEvaluatedKey;

        response.body = JSON.stringify({ 
            message: "Get Role List Successfully",
            count: roles.Count,
            lastEvaluatedKey,
            items: roles.Items
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