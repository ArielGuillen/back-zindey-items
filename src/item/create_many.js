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
  const itemsArr = JSON.parse(event.body?.items)
  itemsArr.forEach(item => {
    const id = uuid.v4()
    const newItem = {
      id,
      ...item
    }
    console.log(newItem)
    try {
      await db.put({ TableName, Item: newItem }).promise()
    }catch (error) {
      console.error(error)
      response.statusCode = 500
      response.body = JSON.stringify({
        message: "Failed to upload Item",
        error: error.message
      })
    }
  })
  response.body = JSON.stringify({
    message: "Items created successfully",
  })
  return response
}