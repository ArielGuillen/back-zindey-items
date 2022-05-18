const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
var lambda = new AWS.Lambda();

 module.exports = async function( LAMBDA_NAME, name ){

    //Create the object to invoke the validation lambda 
    let lambdaParams = {
        FunctionName: LAMBDA_NAME,
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify( { name })
    };


    //Invoke lambda validate_role to check if the role name already exists
    const { Payload } = await lambda.invoke(lambdaParams).promise();
    const { body } = JSON.parse(Payload);
    const lambdaResult = JSON.parse(body);
   
    return lambdaResult;

}