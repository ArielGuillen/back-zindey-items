const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const uuid = require('uuid');
const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async( event ) => {
    const response  = await create_businessLine( event );
    return response;
};

async function create_businessLine ( event ){

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Create Business line" }),
    };
    
    try{

        let { name } = JSON.parse ( event.body );
        const id = uuid.v4();

        let params = {
            TableName : TABLE_NAME,
            Item: {
                id,
                name
            }
        };

        await dynamo.put ( params ).promise();
        response.body= JSON.stringify({ 
            message: "Business line created successfully",
            id,
            name
        });

    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to create business line",  
            error: error.message 
        } );
    }

    return response;
}