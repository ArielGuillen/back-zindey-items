const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME

exports.lambdaHandler =  async ( event ) => {
  const response = {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({ message: "GET Items list" })
  }
  const params = {
    TableName,
    Limit: 10
  }
  try {
    const items = await db.scan(params).promise()
    response.body = JSON.stringify( {
      items: items.Items,
      lastEvaluatedKey: items.LastEvaluatedKey
    })
  }catch( error ) {
    console.log( error )
    response.statusCode = 500
    response.body = JSON.stringify( {
        message: "Failed to get item list",
        error: error.message
    })
  }
  return response
}