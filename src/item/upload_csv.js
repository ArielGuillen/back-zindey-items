const uuid = require('uuid')
const { S3 } = require('aws-sdk')

const s3 = new S3()
const Bucket = process.env.BUCKET_NAME

exports.lambdaHandler = async( event ) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: "Upload csv file" }),
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  }
  try{
    let {  file } = JSON.parse ( event.body )
    //Generate id using uuid v4
    const id = uuid.v4()
    //Get the csv file and decode from base64
    const decodedCsv = Buffer.from( file, "base64" )
    //Create object with the s3 params to upload the file
    let s3Params = {
      Bucket,
      Key: `items-${id}.csv`,
      Body: decodedCsv,
      ContentType: "text/csv"
    }
    await s3.putObject( s3Params ).promise()
    const objectUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/items-${id}.csv`
    response.body= JSON.stringify( {
      message: "File uploaded successfully",
      id,
      key: `csv-items-${id}.csv`,
      objectUrl
    })
  }catch( error ){
    console.log( error );
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to upload file",
      error: error.message
    })
  }
  return response
}