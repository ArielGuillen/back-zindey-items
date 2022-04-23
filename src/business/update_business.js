const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

exports.lambdaHandler = async( event ) => {

    const BUCKET_NAME = 'zindey-bucket-042222';
    const TABLE_NAME = 'BusinessTable';

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({ message: "Successfully uploaded business" }),
    };
    
    //Get the id from the url params
    const id = event.pathParameters.id;

    let {
        name,
        logo,        
        businessLineId,
    } = JSON.parse ( event.body );

    try{

        //Get the image and decode from base64
        const decodedFile = Buffer.from( logo.replace( /^data:image\/\w+;base64,/, "" ), "base64" );
        
        let s3Params = {
            Bucket: BUCKET_NAME,
            Key: `images/item-${id}.jpeg`,
            Body: decodedFile,
            ContentType: "image/jpeg",
        }
        await s3.putObject( s3Params ).promise();

        const logoUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/images/item-${id}.jpeg`
        
        let dynamoParams = {
            TableName : TABLE_NAME,
            Item: {
                id,
                businessLineId,
                name,
                logo: logoUrl
            } 
        }
        await dynamo.put( dynamoParams ).promise();

        response.body= JSON.stringify( { message: "Successfully upload the business data"});

    }catch( error ){
        console.log( error );
        response.body = JSON.stringify( { message: "Failed to upload the business data",  error } );
    }

    return response;
}