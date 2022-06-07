const { DynamoDB } = require("aws-sdk")

const itemExist = require('./validation_exist')

const db = new DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME
const LAMBDA_NAME = process.env.LAMBDA_NAME

exports.lambdaHandler = async ( event ) => {
  let validationResponse = {}
  const response = {
    statusCode: 200,
    isBase64Encoded: false,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    body: JSON.stringify({ message: "Update item type element." })
  }
  //Get the id from the url params
  const { id } = event?.pathParameters
  //Transform the JSON string of body value to a javascript object
  const req = JSON.parse(event.body)
  const paramsArr = Object.keys(req)
  if(req?.type){
    try {
      validationResponse = await itemExist( LAMBDA_NAME, req?.type )
    } catch (error) {
      response.statusCode = 500
      response.body = JSON.stringify({
        message: "Failed to validate item type element.",
        error: error.message
      })
    }
  } else validationResponse.status = true
  if ( validationResponse?.status || validationResponse?.id === id ) {
    const params = {
      TableName,
      Key: { id },
      UpdateExpression: `SET ${paramsArr.map((key) => `#${key} = :${key}`).join(",")}`,
      ExpressionAttributeNames: paramsArr.reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {}),
      ExpressionAttributeValues: paramsArr.reduce((acc, key) => ({ ...acc, [`:${key}`]: req[key] }), {}),
      ReturnValues: "UPDATED_NEW",
    }
    try {
      await db.update(params).promise()
      response.body = JSON.stringify({
        message: "Item type element updated successfully.",
        item: req,
      })
    } catch (error) {
      console.error(error)
      response.statusCode = 500
      response.body = JSON.stringify({
        message: "Failed to update item type element.",
        error: error.message
      })
    }
  } else {
    response.statusCode = 403
    response.body = JSON.stringify({
      message: "Failed to update item type element.",
      error: `Item type element "${req?.type}" already exists.`,
    })
  }
  return response
}