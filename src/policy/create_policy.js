const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
var lambda = new AWS.Lambda();

const uuid = require('uuid');
const TABLE_NAME = process.env.TABLE_NAME;
const LAMBDA_NAME = process.env.LAMBDA_NAME;

exports.lambdaHandler = async( event ) => {
    const response  = await create_policy( event );
    return response;
}

async function create_policy(  event ){
    
    let response = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Create Policy' }),
    };
    
    try{

        let { name, statements } = JSON.parse ( event.body );

        const status = await validate_policy_name( name );

        if ( status ) {
            //Generate id
            const id = uuid.v4();

            await dynamo.put ( {
                TableName : TABLE_NAME,
                Item: {
                    id,
                    name,
                    statements
                }
            } ).promise();

            response.body= JSON.stringify({ 
                message: `Policy ${name} created successfully`,
                id,
                name,
                statements
            });
        }else{
            response.statusCode = 403;
            response.body = JSON.stringify( { 
                message: "Failed to create policy",
                error: `Policy "${name}" already exist`
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

async function validate_policy_name( name ){

    //Create the object to invoke the validation lambda 
    let lambdaParams = {
        FunctionName: LAMBDA_NAME,
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify( { name })
    };


    //Invoke lambda validate_role to check if the role name already exists
    const { Payload } = await lambda.invoke(lambdaParams).promise();
    const { body } = JSON.parse(Payload);
    const lambdaResult = JSON.parse(body);
   
    return lambdaResult.status;

}