const { DynamoDB } = require('aws-sdk')
const db = new DynamoDB.DocumentClient()

const TableName = process.env.TABLE_NAME

exports.lambdaHandler = async (event) => {
  //create the response object
  const response = {
    statusCode: 200,
    isBase64Encoded: false,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    body: JSON.stringify({ message : "Get item types list by type" })
  }
  try{
    //Get the Type filter from the url params
    const type = event.pathParameters.type

    //Create the object with the Dynamo params
    const params = {
      TableName,
      KeyConditionExpression: '#type = :v_type',
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      ExpressionAttributeValues: {
        ':v_type': type
      }
    }
    const typesList = await db.query( params ).promise()
    response.body = JSON.stringify({
      message: "Get item types list successfully",
      count: typesList.Count,
      items: typesList.Items
    })
  }catch( error ){
    console.log( error )
    response.statusCode = 500
    response.body = JSON.stringify( {
      message: "Failed to get item types list",
      error: error.message
    })
  }
  return response
}