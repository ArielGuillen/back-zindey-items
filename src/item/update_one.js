const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME

exports.lambdaHandler = async ( event ) => {
  const response = {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({ message: "Update item" }),
  }
  //Get the id from the url params
  const { id } = event?.pathParameters
  //Transform the JSON string of body value to a javascript object
  const price = JSON.parse(event.body?.price)
  const params = {
    TableName,
    Key: { id },
    UpdateExpression: "set price = :price",
    ExpressionAttributeValues:{
        ":price":price
    },
    ReturnValues:"UPDATED_NEW"
  }
  try {
    const result = await db.update(params).promise();
    response.body = JSON.stringify({
        message: 'Item updated successfully',
        item: result,
    });
  } catch( error ){
    console.log( error );
    response.statusCode = 500;
    response.body = JSON.stringify( {
        message: "Failed to update item",
        error: error.message
    } )
  }
  return response
}
