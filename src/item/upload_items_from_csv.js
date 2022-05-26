const AWS = require('aws-sdk');
const s3Client = new AWS.S3();
const dynamo = new AWS.DynamoDB.DocumentClient();

const uuid = require('uuid');
const csv = require('csvtojson');
const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async( event ) => {
    const response  = await upload_from_csv( event );
    return response;
};

async function upload_from_csv( event ){

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Upload csv file" }),
    };

    try{
        const s3Records = event.Records[0].s3;
        
        const s3Params = { 
            Bucket: s3Records.bucket.name, 
            Key: s3Records.object.key
        };

        const s3Data = await s3Client.getObject( s3Params ).promise();
        const s3Object = s3Data.Body;
        const json = await csv().fromString( s3Object.toString() ); 
        for( let i = 0; i < json.length ; i++ ){
            //create each row into DynamoDB
            let itemParams = {
                TableName: TABLE_NAME,
                Item:{
                    id: uuid.v4(),
                    ...json[i]
                }
            };
            try{
                await dynamo.put(itemParams).promise();
            }catch( error ){
                console.log( error );
            }
        }
        
        console.log("Items uploaded Successfully!");

    }catch( error ){
        console.log( error );
        response.statusCode = 500;
        response.body = JSON.stringify( { 
            message: "Failed to upload items",  
            error: error.message 
        } );
    }

    return response;
}