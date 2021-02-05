# Serverless REST API
Lambda Function TypeScript with AWS DynamoDB

## Structure
```
 - index.ts
 - package.json
 - serverless,yml
 - tsconfig,json
```

## Use-cases

- API for a Web Application
- API for a Mobile Application

## Setup

```bash
yarn install
yarn compile
```

## Deploy

In order to deploy the endpoint simply run

```bash
serverless deploy
```

The expected result should be similar to:

```bash
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service serverless-rest-api-with-dynamodb.zip file to S3 (69.06 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
........................................
Serverless: Stack update finished...
Service Information
service: serverless-rest-api-with-dynamodb
stage: dev
region: us-east-1
stack: serverless-rest-api-with-dynamodb-dev
resources: 35
api keys:
  None
endpoints:
  POST - https://xxx.execute-api.us-east-1.amazonaws.com/dev/api
  GET - https://xxx.execute-api.us-east-1.amazonaws.com/dev/api
  GET - https://xxx.execute-api.us-east-1.amazonaws.com/dev/api/{id}
  PUT - https://xxx.execute-api.us-east-1.amazonaws.com/dev/api/{id}
  DELETE - https://xxx.execute-api.us-east-1.amazonaws.com/dev/api/{id}
functions:
  create: serverless-rest-api-with-dynamodb-dev-create
  list: serverless-rest-api-with-dynamodb-dev-list
  get: serverless-rest-api-with-dynamodb-dev-get
  update: serverless-rest-api-with-dynamodb-dev-update
  delete: serverless-rest-api-with-dynamodb-dev-delete
layers:
  None
Serverless: Removing old service artifacts from S3...
```

## Usage

You can create, retrieve, update, or delete with the following commands:

### Create

```bash
curl -X POST https://xxx.execute-api.us-east-1.amazonaws.com/dev/api --data '{ "text": "Learn Serverless" }'

# Example Result:
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","createdAt":1479138570824,"checked":false,"updatedAt":1479138570824}
```

### List all

```bash
curl https://xxx.execute-api.us-east-1.amazonaws.com/dev/api

# Example output:
[{"text":"Deploy my first service","id":"ac90feaa11e6-9ede-afdfa051af86","checked":true,"updatedAt":1479139961304},{"text":"Learn Serverless","id":"206793aa11e6-9ede-afdfa051af86","createdAt":1479139943241,"checked":false,"updatedAt":1479139943241}]%
```

### Get one

```bash
# Replace the <id> part with a real id from your todos table
curl https://xxx.execute-api.us-east-1.amazonaws.com/dev/api/<id>

# Example Result:
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","createdAt":1479138570824,"checked":false,"updatedAt":1479138570824}%
```

### Update

```bash
# Replace the <id> part with a real id from your todos table
curl -X PUT https://xxx.execute-api.us-east-1.amazonaws.com/dev/api/<id> --data '{ "text": "Learn Serverless", "checked": true }'

# Example Result:
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","createdAt":1479138570824,"checked":true,"updatedAt":1479138570824}%
```

### Delete

```bash
# Replace the <id> part with a real id from your todos table
curl -X DELETE https://xxx.execute-api.us-east-1.amazonaws.com/dev/api/<id>

# No output
```

## Scaling

### AWS Lambda

By default, AWS Lambda limits the total concurrent executions across all functions within a given region to 100. The default limit is a safety limit that protects you from costs due to potential runaway or recursive functions during initial development and testing. To increase this limit above the default, follow the steps in [To request a limit increase for concurrent executions](http://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html#increase-concurrent-executions-limit).

### DynamoDB

When you create a table, you specify how much provisioned throughput capacity you want to reserve for reads and writes. DynamoDB will reserve the necessary resources to meet your throughput needs while ensuring consistent, low-latency performance. You can change the provisioned throughput and increasing or decreasing capacity as needed.

This is can be done via settings in the `serverless.yml`.

```yaml
  ProvisionedThroughput:
    ReadCapacityUnits: 1
    WriteCapacityUnits: 1
```

In case you expect a lot of traffic fluctuation we recommend to checkout this guide on how to auto scale DynamoDB [https://aws.amazon.com/blogs/aws/auto-scale-dynamodb-with-dynamic-dynamodb/](https://aws.amazon.com/blogs/aws/auto-scale-dynamodb-with-dynamic-dynamodb/)
