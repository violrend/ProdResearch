// lib/dynamodb.js
import AWS from 'aws-sdk';

const config = {
  region: 'us-west-2', // Replace with your DynamoDB region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Store these in environment variables
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

AWS.config.update(config);

const dynamodb = new AWS.DynamoDB.DocumentClient();

export default dynamodb;