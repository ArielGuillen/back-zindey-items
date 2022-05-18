const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async ( event ) => {
    const response  = await Validate_role( event );
    return response;
};

async function Validate_role( event ){

    //Create the response object
    const response = {
        statusCode: 200,
        body: JSON.stringify( { message: "Validate Role name"} )
    };

    try{

        //Get the role name from the body request 
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
        response.body = JSON.stringify({ message: "Role list", result });

        // Check if the result contain a value the name is repeat
        if( result.Count == 0 )
            response.body = JSON.stringify({
                status: true,
                message: `Role ${name} available`
            });
        else{            
            response.statusCode = 403;
            response.body = JSON.stringify({ 
                status: false,
                message: `Role ${name} already exist`, 
                id: result.Items[0].id
            });
        }
    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify({ 
            status: false,
            message: "Failed to validate role", 
            error: error.message 
        });
    }

    return response;

}
