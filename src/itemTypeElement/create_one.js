const uuid = require('uuid')
const { DynamoDB } = require('aws-sdk')

const itemTypeElement = require('../common/validation_exist')

const db = new DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME
const LAMBDA_NAME = process.env.LAMBDA_NAME

exports.lambdaHandler = async( event ) => {
  //create the response object
  const response = {
    statusCode: 200,
    isBase64Encoded: false,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    body: JSON.stringify({ message: "Create item type element" })
  }
  //Transform the JSON string of body value to a javascript object
  const req = JSON.parse(event.body)
  try {
    validationResponse = await itemTypeElement( LAMBDA_NAME, req?.name )
  } catch (error) {
    console.log(error)
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to validate item type element.",
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
        message: "Item type element created successfully.",
        item: newItem
      })
    }catch (error) {
      console.error(error)
      response.statusCode = 500
      response.body = JSON.stringify({
        message: "Failed to crete item type element.",
        error: error.message
      })
    }
  }else {
    response.statusCode = 403;
    response.body = JSON.stringify({
      message: "Failed to create item type element.",
      error: `Item type element "${req?.name}" already exists.`
    })
  }
  return response
}
