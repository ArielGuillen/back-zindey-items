const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async( event ) => {
    const response  = await create_itemType( event );
    return response;
};

async function create_itemType( event ){
    
    //create the response object
    const response = {
        statusCode: 200,
        isBase64Encoded: false,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({ message: "Update item type" })
    };
    
    try {
        //Get the BusinessLine id from the query params
        const querystring = event.queryStringParameters;
        const id = querystring.id;
        
        // Get and convert data from the body request
        const { type, value } = JSON.parse( event.body );
        
        //Code to update

        response.body= JSON.stringify({ 
            message: `Type -${type} : ${value}- created successfully`,
            id,
            type,
            value
        });

    } catch( error ) {
        console.log(error);
        response.statusCode = 500;
        response.body = JSON.stringify({ 
            message: "Failed to create item type" , 
            error: error.message 
        });
    }

    return response;
}
