const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const fetch = require("node-fetch");

async function verifyUser(token) {
  const jwksUrl = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
  const response = await fetch(jwksUrl);
  const jwks = await response.json();
  const jwk = jwks.keys[0];
  const pem = jwkToPem(jwk);
  const decoded = jwt.verify(token, pem, { algorithms: ["RS256"] });
  return decoded;
}

exports.handler = async (event) => {
  const { httpMethod, body, headers } = event;
  const requestBody = JSON.parse(body);

  try {
    await verifyUser(headers.Authorization);
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  switch (httpMethod) {
    case "GET":
      return getTasks();
    case "POST":
      return createTask(requestBody);
    case "PUT":
      return updateTask(requestBody);
    case "DELETE":
      return deleteTask(requestBody);
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid request" }),
      };
  }
};

async function getTasks() {
  const params = {
    TableName: process.env.TASKS_TABLE,
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not fetch tasks" }),
    };
  }
}

async function createTask(task) {
  const params = {
    TableName: process.env.TASKS_TABLE,
    Item: {
      id: uuidv4(),
      taskName: task.taskName,
      notes: task.notes,
      dueDate: task.dueDate,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not create task" }),
    };
  }
}

async function updateTask(task) {
  const params = {
    TableName: process.env.TASKS_TABLE,
    Key: {
      id: task.id,
    },
    UpdateExpression: "set taskName = :taskName, notes = :notes, dueDate = :dueDate",
    ExpressionAttributeValues: {
      ":taskName": task.taskName,
      ":notes": task.notes,
      ":dueDate": task.dueDate,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const data = await dynamoDB.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Attributes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not update task" }),
    };
  }
}

async function deleteTask(task) {
  const params = {
    TableName: process.env.TASKS_TABLE,
    Key: {
      id: task.id,
    },
  };

  try {
    await dynamoDB.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Task deleted successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not delete task" }),
    };
  }
}