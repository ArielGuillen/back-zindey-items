const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async ( event ) => {
    const response  = await validate_policy( event );
    return response;
}

async function validate_policy( event ) {

    //Create the response object
    let response = {
        statusCode: 200,
        body: JSON.stringify( { message: "Validate policy name", status: false} )
    };

    try{

        //Get the policy name from the body request 
        const name = event.name;
        //Create the object with the DynamoDB params
        const params = {
            TableName : TABLE_NAME,
            IndexName : "GSIFindByName",
            KeyConditionExpression: '#name = :v_name',
            ExpressionAttributeNames: {
                '#name': 'name',
            },
            ExpressionAttributeValues: {
                ':v_name': name
            }
        };
        
        const result = await dynamo.query(params).promise();
        response.body = JSON.stringify({ message: "Policy list", result });

        // Check if the result contain a value, the name is repeat
        if( result.Count == 0 )
            response.body = JSON.stringify({ message: `Policy name ${name} available`, status: true });
        else{
            response.statusCode = 403;
            response.body = JSON.stringify({ message: `Policy ${name} already exist`, status: false });
        }
    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify({ 
            status: false,
            message: "Failed to validate Policy",
            error: error.message 
        });
    }
    return response;
};