const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME

exports.lambdaHandler = async ( event ) => {
  const response = {
    isBase64Encoded: false,
    statusCode: 200,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    body: JSON.stringify({ message: "Delete item type element." })
  }
  const { id } = event?.pathParameters
  const params = {
    TableName,
    Key: { id },
  }
  try {
    await db.delete(params).promise()
    response.body = JSON.stringify({ message: "Item type element deleted successfully." })
} catch (error) {
    console.log(error)
    response.statusCode = 500
    response.body = JSON.stringify({
      message: "Failed to delete item type element.",
      error: error.message
    })
  }
  return response
}