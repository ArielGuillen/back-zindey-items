const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

const TABLE_NAME = process.env.TABLE_NAME;
const LAMBDA_NAME = process.env.LAMBDA_NAME;

const validate_name = require('./validate_name.js');

exports.lambdaHandler = async( event ) => {
    const response  = await create_role( event );
    return response;
};

async function create_role( event ){
    
    //create the response object
    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Role created successfully!" })
    };
    
    try {
        // Get and convert data from the body request
        const { name, policies } = JSON.parse(event.body);
        
        const result = await validate_name( LAMBDA_NAME, name );

        if ( result.status ) {
            const id = uuid.v4();
            let params = {
                TableName : TABLE_NAME,
                Item: {
                    id,
                    name,
                    policies
                }
            };

            await dynamo.put ( params ).promise();
            response.body= JSON.stringify({ 
                message: `Role -${name}- created successfully`,
                id,
                name,
                policies
            });
        }else{
            response.statusCode = 403;
            response.body = JSON.stringify( { 
                message: "Failed to create role",
                error: `Role -${name}- already exists`
            } );
        }

    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.body = JSON.stringify({ 
            message: "Failed to create Rol" , 
            error: error.message 
        });
    }

    return response;
}
