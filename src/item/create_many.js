const uuid = require('uuid')
const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME

exports.lambdaHandler = async ( event ) => {
  const response = {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({ message: "Create multiple items" })
  }
  //Transform the JSON string of body value to a javascript object
  const req = JSON.parse(event.body)
  for(let i = 0; i < req?.items?.length; i++) {
    const id = uuid.v4()
    const newItem = {
      id,
      ...req?.items[i]
    }
    console.log(newItem)
    try {
      await db.put({ TableName, Item: newItem }).promise()
      if(i === req?.items?.length - 1) {
        response.body = JSON.stringify({
          message: "Items created successfully",
        })
      }
    }catch (error) {
      console.error(error)
      response.statusCode = 500
      response.body = JSON.stringify({
        message: "Failed to upload Item",
        error: error.message
      })
    }
  }
  return response
}