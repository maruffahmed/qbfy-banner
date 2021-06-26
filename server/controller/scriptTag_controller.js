import { DataType } from "@shopify/shopify-api";

// Controller for create an script tag
export async function createScriptTag(ctx) {
  const { myClient } = ctx;
  // Check the shopify client
  if (!myClient) {
    throw new Error("Client didn't found");
  }

  try {
    // Try to create script tag
    const data = {
      script_tag: {
        event: "onload",
        src: "https://facebook.com",
      },
    };
    const result = await myClient.post({
      path: "script_tags",
      data,
      type: DataType.JSON,
    });
    // script tag create success response
    ctx.body = result.body;
  } catch (error) {
    // string tag create fail response
    ctx.body = {error : error.message};
  }
}

// Contoller for geting script tags
export async function getScriptTags(ctx) {
  // Script tag Search query
  const query = ctx.query;
  const { myClient } = ctx;
  // Check the shopify client
  if (!myClient) {
    throw new Error("Client didn't found");
  }

  try {
    // Try to get all the script tags
    const result = await myClient.get({
      path: "script_tags",
      query,
    });
    // Get Script tag success response
    ctx.body = result.body;
  } catch (error) {
    // Get script tag fail response
    ctx.body = {error : error.message};
  }
}

export async function deleteScriptTags(ctx) {
  // Script tag id
  const { scriptId } = ctx.params;
  const { myClient } = ctx;
  // Check the shopify client
  if (!myClient) {
    throw new Error("Client didn't found");
  }
  try {
    // Try to delete script tag
    const result = await myClient.delete({
      path: `script_tags/${scriptId}`,
    });
    ctx.body = { message: "Script tag delete successfully" };
  } catch (error) {
    ctx.body = { error: result.message };
  }
}

// function getBaseUrl(shop){
//     return `https://${shop}`;
// }

// function handleGetAllScriptTags(shop){
//     return `${getBaseUrl(shop)}/admin/api/2021-04/script_tags.json`;
// }

// function handleGetScriptTag(shop,id){
//     return `${getBaseUrl(shop)}/admin/api/2021-04/script_tags/${id}.json`;
// }

// function handleCreateScriptTag(shop){
//     return `${getBaseUrl(shop)}/admin/api/2021-04/script_tags.json`;
// }

// function handelDeleteScriptTag(shop,id){
//     return `${getBaseUrl(shop)}/admin/api/2021-04/script_tags/${id}.json`;
// }
