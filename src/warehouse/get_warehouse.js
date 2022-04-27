const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event) => {

  const TABLE_NAME = "WarehouseTable";

  const response = {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({ message: "" }),
  };

  try {

    const warehouseItems = await dynamo.scan({
      TableName: TABLE_NAME,
      Limit: 5
    }).promise();

    response.body = JSON.stringify({
      warehouseItems,
      LastEvaluatedKey: warehouseItems.LastEvaluatedKey
    })

  } catch (error) {
    console.log(error);
    response.body = JSON.stringify({ message: "Failed to get the warehouse items", error });
  }

  return response;

}