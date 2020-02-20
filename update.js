import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  let UE, Attributes;
  if (data.attachment || data.content) {
    if (data.attachment && data.content) {
      UE = "SET content = :content, attachment = :attachment";
      Attributes = {":attachment": data.attachment, ":content": data.content};
    } else if (data.attachment) {
      UE = "SET attachment = :attachment";
      Attributes = {":attachment": data.attachment};
    } else {
      UE = "SET content = :content";
      Attributes = {":content": data.content};
    }
  } else {
    return success({ status: true, message: "No updates specified"});
  }
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: UE,
    ExpressionAttributeValues: Attributes,
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  try {
    const r = await dynamoDbLib.call("update", params);
    return success({ status: true, ...r});
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}