const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
var lambda = new AWS.Lambda();

const uuid = require('uuid');

const TABLE_NAME = process.env.TABLE_NAME;
//Set the name of the invoke lambda
const LAMBDA_NAME = process.env.LAMBDA_NAME;

exports.lambdaHandler = async (event) => {

    //create the response object
    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Role created successfully!" })
    };
    
    try {
        // Get and convert data from the body request
        const { name, policies } = JSON.parse(event.body);
        
        //Create the object to invoke the validation lambda 
        let lambdaParams = {
            FunctionName: LAMBDA_NAME,
            InvocationType: 'RequestResponse',
            LogType: 'Tail',
            Payload: JSON.stringify( {
                body: {
                    name
                }
            })
        };


        //Invoke lambda validate_role to check if the role name already exists
        const { Payload } = await lambda.invoke(lambdaParams).promise();
        const { body } = JSON.parse(Payload);
        const lambdaResult = JSON.parse(body);
        let result;
        
        if (lambdaResult.status == true) {

            //Generate an id for the new role using uuid v4
            const id = uuid.v4();

            // Create an object with the DynamoDB parameters 
            // Item is the data of the new object
            const params = {
                TableName: TABLE_NAME,
                Item: {
                    id,
                    name,
                    policies
                }
            };

            result = await dynamo.put(params).promise();
            response.body = JSON.stringify({ message: `Role ${name} created successfully` }, result);

        }else{
            response.statusCode = 403;
            response.body = JSON.stringify({ message: `Role ${name} already exist` });
        }

    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.body = JSON.stringify({ 
            message: "Failed to create Rol" , 
            error: error.message 
        });
    }

    return response;
};
