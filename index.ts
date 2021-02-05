'use strict'

import { v4 as uuidv4 } from 'uuid'
import * as AWS from 'aws-sdk'

// locally test
// const dynamoDb = new AWS.DynamoDB.DocumentClient({ endpoint: 'http://dynamo-local:8000'})
const dynamoDb = new AWS.DynamoDB.DocumentClient()
const params = {
  TableName: process.env.DYNAMODB_TABLE,
}

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body)
  if (typeof data.text !== 'string') {
    console.error('Validation Failed')
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the todo item.',
    })
    return
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuidv4(),
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  }

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the todo item.',
      })
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    }
    callback(null, response)
  })
}

module.exports.list = (event, context, callback) => {
  // fetch all todos from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todos.',
      })
      return
    }

    // create a response
    console.log(result.Items)
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    }
    callback(null, response)
  })
}

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  }

  // fetch todo from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      })
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    }
    callback(null, response)
  })
}

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body)

  // validation
  if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
    console.error('Validation Failed')
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the todo item.',
    })
    return
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#todo_text': 'text',
    },
    ExpressionAttributeValues: {
      ':text': data.text,
      ':checked': data.checked,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  }

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      })
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    }
    callback(null, response)
  })
}

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  }

  // delete the todo from the database
  dynamoDb.delete(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t remove the todo item.',
      })
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({}),
    }
    callback(null, response)
  })
}