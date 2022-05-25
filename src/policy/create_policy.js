const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const uuid = require('uuid');

const TABLE_NAME = process.env.TABLE_NAME;
const LAMBDA_NAME = process.env.LAMBDA_NAME;

const validate_name = require('./validate_name.js');

exports.lambdaHandler = async( event ) => {
    const response  = await update_policy( event );
    return response;
};

async function update_policy( event ){ 

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Create Policy' }),
    };
    
    try{
        
        let { name, statements } = JSON.parse ( event.body );

        const result = await validate_name( LAMBDA_NAME, name );

        if ( result.status ) {
            const id = uuid.v4();
            let params = {
                TableName : TABLE_NAME,
                Item: {
                    id,
                    name,
                    statements
                }
            };

            await dynamo.put ( params ).promise();
            response.body= JSON.stringify({ 
                message: `Policy -${name}- created successfully`,
                id,
                name,
                statements
            });
        }else{
            response.statusCode = 403;
            response.body = JSON.stringify( { 
                message: "Failed to create policy",
                error: `Policy -${name}- already exists`
            } );
        }

    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to create policy",
            error: error.message 
        } );
    }

    return response;
}
