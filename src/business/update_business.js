const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const TABLE_NAME = process.env.TABLE_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;

exports.lambdaHandler = async( event ) => {
    const response  = await update_business( event );
    return response;
};

async function update_business( event ){

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Update Business" }),
    };
    
    try{
        //Get the BusinessLine id from the query params
        const querystring = event.queryStringParameters;
        const id = querystring.id;

        let {
            accountId,
            name,
            businessLineId,
            logo,
            branches,
            warehouses
        } = JSON.parse ( event.body );

        /*
        //Get the image decoded and optimized
        const resizedImage = await compress_image( logoBase64 );
        
        //Create object with the s3 params to upload the file
        let s3Params = {
            Bucket: BUCKET_NAME,
            Key: `business-logo-${id}.jpeg`,
            Body: resizedImage,
            ContentType: "image/jpeg",
        }

        await s3.putObject( s3Params ).promise();
        const logoUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/business-logo-${id}.jpeg`
        
        */
        let dynamoParams = {
            TableName : BUSINESS_TABLE_NAME,
            Item: {
                id,
                accountId,
                name,
                businessLineId,
                logo,
                branches,
                warehouses
            } 
        }
        await dynamo.put( dynamoParams ).promise();
        
        response.body= JSON.stringify( { 
            message: "Business updated successfully",
            id,
            accountId,
            name,
            businessLineId,
            logo,
            branches,
            warehouses
        });

    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to update business",  
            error: error.message 
        } );
    }

    return response;
}