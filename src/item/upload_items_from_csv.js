const { S3, DynamoDB } = require('aws-sdk')

const s3Client = new S3()
const db = new DynamoDB.DocumentClient()

const uuid = require('uuid')
const csv = require('csvtojson')
const TableName = process.env.TABLE_NAME

exports.lambdaHandler = async( event ) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: "Upload csv file" }),
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  }
  try{
    const s3Records = event.Records[0].s3
    const s3Params = {
      Bucket: s3Records.bucket.name,
      Key: s3Records.object.key
    }
    const s3Data = await s3Client.getObject( s3Params ).promise()
    const s3Object = s3Data.Body
    const json = await csv().fromString( s3Object.toString() )
    for( let i = 0; i < json.length ; i++ ){
      //create each row into DynamoDB
      let itemParams = {
        TableName,
        Item:{
          id: uuid.v4(),
          ...json[i]
        }
      }
      try{
        await db.put(itemParams).promise()
      }catch( error ){
        console.log( error )
      }
    }
    console.log("Items uploaded Successfully!")
  }catch( error ){
    console.log( error )
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to upload items",
      error: error.message
    })
  }
  return response
}