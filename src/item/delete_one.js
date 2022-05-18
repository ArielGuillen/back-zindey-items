const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME

exports.lambdaHandler = async ( event ) => {
  const response = {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({ message: "Delete item" })
  }
  const { id } = event?.pathParameters
  const params = {
    TableName,
    Key: { id },
  }
  try {
    await db.delete(params).promise()
    response.body = JSON.stringify({ message: "Item deleted successfully" })
} catch (error) {
    console.log(error)
    response.statusCode = 500
    response.body = JSON.stringify({
      message: "Failed to delete item",
      error: error.message
    })
  }
  return response
}