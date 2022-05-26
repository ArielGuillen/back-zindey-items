const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async( event ) => {
    const response  = await update_businessLine( event );
    return response;
};

async function update_businessLine ( event ){

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({ message: "Update Business line" })
    };
        
    try{
        //Get the BusinessLine id from the url params
        const id = event.pathParameters.id;
    
        let { name } = JSON.parse ( event.body );

        let params = {
            TableName : TABLE_NAME,
            Item: {
                id,
                name
            }
        };

        await dynamo.put ( params ).promise();
        response.body= JSON.stringify({ 
            message: "Business line updated successfully",
            id,
            name 
        });
        
    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to update business line",  
            error: error.message 
        } );
    }

    return response;
}