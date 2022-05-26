const uuid = require('uuid')
const { DynamoDB } = require("aws-sdk")

const itemExist = require('./validation_exist')

const db = new DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME
const LAMBDA_NAME = process.env.LAMBDA_NAME

exports.lambdaHandler = async ( event ) => {
  let validationResponse = {}
  const response = {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({ message: "Create item." })
  }
  //Transform the JSON string of body value to a javascript object
  const req = JSON.parse(event.body)
  try {
    validationResponse = await itemExist( LAMBDA_NAME, req?.name )
  } catch (error) {
    console.log(error)
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to validate item.",
      error: error.message
    })
  }
  if( validationResponse?.status ){
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
        message: "Item created successfully.",
        item: newItem
      })
    }catch (error) {
      console.error(error)
      response.statusCode = 500
      response.body = JSON.stringify({
        message: "Failed to crete item.",
        error: error.message
      })
    }
  }else {
    response.statusCode = 403;
    response.body = JSON.stringify({
      message: "Failed to create item.",
      error: `Item "${req?.name}" already exists.`
    })
  }
  return response
}
