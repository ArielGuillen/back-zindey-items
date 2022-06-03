const { DynamoDB } = require('aws-sdk')

const db = new DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME

exports.lambdaHandler = async ( event ) => {
  let queryResponse = null
  //Create the response object
  const response = {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    body: JSON.stringify({ message: "Validate item type element name." })
  }
  //Get the item name from the body request
  const name = event?.name
  //Create the object with the DynamoDB params
  const params = {
    TableName : TableName,
    IndexName : "GSIFindByName",
    KeyConditionExpression: '#name = :v_name',
    ExpressionAttributeNames: {
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':v_name': name
    }
  }
  try {
    queryResponse = await db.query(params).promise()
    response.body = JSON.stringify({ message: "Item type element list", queryResponse })
  }catch( error ) {
    console.log( error )
    response.statusCode = 500
    response.body = JSON.stringify({
      status: false,
      message: "Failed to validate the item type element name.",
      error: error.message
    })
  }
  // Check if the result contain a value the name is repeat
  if( queryResponse?.Count === 0 )
    response.body = JSON.stringify({
      status: true,
      message: `Item type element name available.`
    })
  else{
    response.statusCode = 403
    response.body = JSON.stringify({
      status: false,
      message: `Item type element "${name}" already exist.`,
      id: queryResponse?.Items[0]?.id
    })
  }
  return response
}
