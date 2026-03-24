const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-2",
});

// Map API paths to DynamoDB table names
const TABLE_MAP = {
  "/casestudies": "Toolkit-CaseStudyProjects",
  "/policies": "Toolkit-CaseStudyPolicies",
  "/maldevelopment": "Toolkit-CaseStudyMaldevelopment",
};

exports.handler = async (event) => {
  console.log("Incoming event:", JSON.stringify(event));

  // Get the table name from the path
  const path = event.path || event.requestContext?.path || "/casestudies";
  const tableName = TABLE_MAP[path] || TABLE_MAP["/casestudies"];

  try {
    const result = await client.send(
      new ScanCommand({
        TableName: tableName,
      })
    );

    const items = (result.Items || []).map((item) => unmarshall(item));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(items),
    };
  } catch (err) {
    console.error("Error scanning DynamoDB:", err);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Server error while fetching case studies",
        error: err.message,
      }),
    };
  }
};
