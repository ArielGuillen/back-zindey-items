const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler =  async ( event ) => {
    var returnValue = await dynamo.scan({ TableName: "MyTableItem" }).promise();
    var statusCode = 200;
    return {
        "statusCode": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "isBase64Encoded": false,
        "body": JSON.stringify(returnValue)
      }
}