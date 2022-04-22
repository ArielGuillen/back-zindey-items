const AWS = require("aws-sdk");
//const s3 = new AWS.S3();
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async ( event ) => {

    //const BUCKET_NAME = 'bucket-test-040422';
    const TABLE_NAME = 'MyTableItem';

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({ message: "Successfully uploaded item" }),
    };

    //Transform the JSON string of body value to a javascript object
    let { 
        id, 
        name,
        category, 
        price,
        
        //base64File 
    } = JSON.parse(event.body);

    //Get the image and decode from base64
    //const decodedFile = Buffer.from( base64File.replace( /^data:image\/\w+;base64,/, "" ), "base64" );

    try {
        await dynamo.put({
            TableName: TABLE_NAME,
            Item: {
                id,
                name,
                price,
                category
            }
        }).promise();

        //upload to s3 bucket
        /*await s3.putObject({
            Bucket: BUCKET_NAME,
            Key: `images/${new Date().toISOString()}.jpeg`,
            Body: decodedFile,
            ContentType: "image/jpeg",
        }).promise();*/
        
        response.body = JSON.stringify({ 
            message: "Successfully uploaded item",
            id,
            name,
            price,
            category
        });
        
    } catch (error) {
        console.error(error);
        response.body = JSON.stringify({ message: "Item failed to upload", errorMessage: error });
        response.statusCode = 500;
    }
    return response;
}
