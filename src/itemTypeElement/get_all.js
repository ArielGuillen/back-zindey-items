const { DynamoDB } = require('aws-sdk')
const db = new DynamoDB.DocumentClient()

const TableName = process.env.TABLE_NAME

exports.lambdaHandler = async (event) => {
  //create the response object
  const response = {
    statusCode: 200,
    isBase64Encoded: false,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    body: JSON.stringify({ message : "Get item type element list" })
  }
  try{
    //Get the start key and limit from the query params
    const querystring = event.queryStringParameters
    const startKey = querystring.startKey
    const limit = querystring.limit
    //Create the object with the Dynamo params
    let params = {}
    //If startkey is equals to 0 is the first scan and don't have a startkey
    if( startKey == '0' )
      params = {
        TableName,
        Limit: limit
      }
    else
      params = {
        TableName,
        ExclusiveStartKey: { "id": startKey },
        Limit: limit
      }
    const typesList = await db.query( params ).promise()
    let lastEvaluatedKey = ""
    if( typesList.LastEvaluatedKey != null )
      lastEvaluatedKey = typesList.LastEvaluatedKey
    response.body = JSON.stringify({
      message: "Get item types list successfully",
      count: typesList.Count,
      lastEvaluatedKey,
      items: typesList.Items
    })
  }catch( error ){
    console.log( error )
    response.statusCode = 500
    response.body = JSON.stringify({
      message: "Failed to get item types list",
      error: error.message
    })
  }
  return response
}