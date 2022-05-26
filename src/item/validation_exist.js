const { Lambda } = require('aws-sdk')

var lambda = new Lambda()

module.exports = async function( LAMBDA_NAME, name ) {
  //Create the object to invoke the validation lambda
  let lambdaParams = {
    FunctionName: LAMBDA_NAME,
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify( { name } )
  }
  //Invoke lambda item_validation to check if the role name already exists
  const { Payload } = await lambda.invoke(lambdaParams).promise()
  const { body } = JSON.parse(Payload)
  const lambdaResult = JSON.parse(body)
  return lambdaResult
}