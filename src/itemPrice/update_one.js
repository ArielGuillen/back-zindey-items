const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME

exports.lambdaHandler = async ( event ) => {
  let validationResponse = {}
  const response = {
    statusCode: 200,
    isBase64Encoded: false,
    body: JSON.stringify({ message: "Update item price." }),
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  }
  //Get the id from the url params
  const { id } = event?.pathParameters
  //Transform the JSON string of body value to a javascript object
  const req = JSON.parse(event.body)
  const paramsArr = Object.keys(req)
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
      message: "Item price updated successfully.",
      item: req,
    })
  } catch (error) {
    console.error(error)
    response.statusCode = 500
    response.body = JSON.stringify({
      message: "Failed to update item price.",
      error: error.message
    })
  }
  return response
}