const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.lambdaHandler = async (event) => {

  const response = {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({ message: "Get Warehouses list" }),
  };

  try {

    const warehouseItems = await dynamo.scan({
      TableName: TABLE_NAME,
      Limit: 5
    }).promise();

    response.body = JSON.stringify({
      warehouseItems,
      lastEvaluatedKey: warehouseItems.LastEvaluatedKey
    })

  }catch( error ){
    console.log( error );
    response.statusCode = 500;
    response.body = JSON.stringify( { 
        message: "Failed to get warehouses list",
        error: error.message 
    });
} 

  return response;

}