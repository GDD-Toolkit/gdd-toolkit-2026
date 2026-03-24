/**
 * Lambda handler for retrieving case studies from DynamoDB (CommonJS version)
 * 
 * This is an alternative CommonJS version in case Amplify generates your function
 * with CommonJS instead of ES modules. If Amplify uses CommonJS, rename this file
 * to index.js and remove the .commonjs.js version.
 * 
 * This function:
 * - Reads all case studies from the Toolkit-CaseStudyProjects DynamoDB table
 * - Converts DynamoDB attribute format to plain JSON
 * - Returns the list of case studies as a JSON response for API Gateway
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Lambda handler function
 * @param {Object} event - API Gateway event object
 * @returns {Object} API Gateway response object
 */
exports.handler = async (event) => {
    try {
        // Get table name from environment variable
        const tableName = process.env.CASE_STUDY_TABLE;
        
        if (!tableName) {
            throw new Error('CASE_STUDY_TABLE environment variable is not set');
        }

        // Scan the DynamoDB table to get all case studies
        const command = new ScanCommand({
            TableName: tableName,
        });

        const response = await docClient.send(command);

        // Convert DynamoDB items to plain JSON objects
        // The DynamoDBDocumentClient already handles marshall/unmarshall automatically
        const caseStudies = response.Items || [];

        // Return success response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Adjust CORS as needed
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
            },
            body: JSON.stringify({
                success: true,
                count: caseStudies.length,
                data: caseStudies,
            }),
        };
    } catch (error) {
        console.error('Error retrieving case studies:', error);

        // Return error response
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: false,
                error: error.message || 'Internal server error',
            }),
        };
    }
};

