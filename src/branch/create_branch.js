const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const uuid = require('uuid');
const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async( event ) => {
    const response  = await create_branch( event );
    return response;
};

async function create_branch( event ){

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Crete Branch" }),
    };
    
    try{

        let { 
            name,
            contact,
            address 
        } = JSON.parse ( event.body );
        const id = uuid.v4();

        let params = {
            TableName : TABLE_NAME,
            Item: {
                id,
                name,
                contact,
                address
            }
        };

        await dynamo.put ( params ).promise();
        response.body= JSON.stringify({ 
            message: "Branch created successfully",
            id,
            name,
            contact,
            address 
        });

    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to create Branch ",  
            error: error.message 
        } );
    }

    return response;
}