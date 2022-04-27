const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event) => {

  const TABLE_NAME = "BusinessLineTable";

  const response = {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({ message: "" }),
  };

  try {

    const businessLineItems = await dynamo.scan({
      TableName: TABLE_NAME,
      Limit: 5
    }).promise();

    response.body = JSON.stringify({
      businessLineItems,
      LastEvaluatedKey: businessLineItems.LastEvaluatedKey
    })

  } catch (error) {
    console.log(error);
    response.body = JSON.stringify({ message: "Failed to get the business line items", error });
  }

  return response;

}