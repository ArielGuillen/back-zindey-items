version = 0.1
[y]
[y.deploy]
[y.deploy.parameters]
stack_name = "Zindey-delivery-041822"
s3_bucket = "aws-sam-cli-managed-default-samclisourcebucket-k6uopu3b3yob"
s3_prefix = "Zindey-delivery-041822"
region = "us-east-1"
confirm_changeset = true
capabilities = "CAPABILITY_IAM"
parameter_overrides = "MyTableName=\"MyTableItem\" BusinessesTableName=\"BusinessTable\" BusinessLineTableName=\"BusinessLineTable\" ImagesBucketName=\"zindey-bucket-042222\" MyCognitoUserPoolArn=\"arn:aws:cognito-idp:us-east-1:213198851588:userpool/us-east-1_fvuuXTrCB\""
image_repositories = []
