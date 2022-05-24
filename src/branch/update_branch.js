const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async( event ) => {
    const response  = await update_branch( event );
    return response;
};

async function update_branch( event ){ 

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Update branch' }),
    };
    
    try{
        
        //Get the branch id from the query params
        const querystring = event.queryStringParameters;
        const id = querystring.id;

        let { 
            name, 
            contact,
            address
        } = JSON.parse ( event.body );


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
            message: `Branch -${name}- updated successfully`,
            id,
            name,
            contact,
            address
        });

    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to update branch",
            error: error.message 
        } );
    }

    return response;
}
