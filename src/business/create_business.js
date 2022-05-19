const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const uuid = require('uuid');

const BUSINESS_TABLE_NAME = process.env.BUSINESS_TABLE_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;

const compress_image = require('./compress_image.js');

exports.lambdaHandler = async( event ) => {
    const response  = await create_business( event );
    return response;
};

async function create_business( event ){

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Create Business" }),
    };

    try{
        let {
            accountId,
            name,
            businessLineId,
            logo,
            branches,
            warehouses
        } = JSON.parse ( event.body );

        //Generate business id using uuid v4
        const id = uuid.v4();
        //Get the image decoded and optimized
        const resizedImage = await compress_image( logo );
        
        //Create object with the s3 params to upload the file
        let s3Params = {
            Bucket: BUCKET_NAME,
            Key: `business-logo-${id}.jpeg`,
            Body: resizedImage,
            ContentType: "image/jpeg",
        }

        await s3.putObject( s3Params ).promise();

        const logoUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/business-logo-${id}.jpeg`
        
        let dynamoParams = {
            TableName : BUSINESS_TABLE_NAME,
            Item: {
                id,
                accountId,
                name,
                businessLineId,
                logo: logoUrl,
                branches,
                warehouses
            } 
        }
        await dynamo.put( dynamoParams ).promise();

        response.body= JSON.stringify( { 
            message: "Business created successfully",
            id,
            accountId,
            name,
            businessLineId,
            logo: logoUrl,
            branches,
            warehouses
        });

    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to create business",  
            error: error.message 
        } );
    }

    return response;
}