const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;
const LAMBDA_NAME = process.env.LAMBDA_NAME;

const validate_name = require('./validate_name.js');

exports.lambdaHandler = async( event ) => {
    const response  = await update_role( event );
    return response;
};


async function update_role( event ){ 
    //create the response object
    const response = {
        statusCode: 200,
        body: JSON.stringify({message : "Role updated successfully!"})
    };

    try{
        
        //Get the BusinessLine id from the query params
        const querystring = event.queryStringParameters;
        const id = querystring.id;

        let { name, policies } = JSON.parse ( event.body );

        const result = await validate_name( LAMBDA_NAME, name );

        if ( result.status || result.id == id ) {

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
                message: `Role -${name}- updated successfully`,
                id,
                name,
                policies
            });
        }else{
            response.statusCode = 403;
            response.body = JSON.stringify( {
                message: "Failed to update role",
                error: `Role -${name}- already exists`
            } );
        }

    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to update role",
            error: error.message 
        });
    }
    
    return response;
};
