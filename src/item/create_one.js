const uuid = require('uuid')
const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME

exports.lambdaHandler = async ( event ) => {
  const response = {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({ message: "Create item" })
  }
  //Transform the JSON string of body value to a javascript object
  const req = JSON.parse(event.body)
  const id = uuid.v4()
  const newItem = {
    id,
    ...req
  }
  const params = {
    TableName,
    Item: newItem
  }
  try {
    await db.put(params).promise()
    response.body = JSON.stringify({
      message: "Created item successfully",
      item: newItem
    })
  }catch (error) {
    console.error(error)
    response.statusCode = 500
    response.body = JSON.stringify({
        message: "Failed to upload Item",
        error: error.message
    })
  }
  return response
}
