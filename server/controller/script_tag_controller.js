import { DataType } from "@shopify/shopify-api";

// Controller for create an script tag
export async function createScriptTag(client) {
  // Check shopify client
  if (!client) {
    // If client didn't found
    throw new Error("Client didn't found");
  }

  try {
    const data = {
      script_tag: {
        event: "onload",
        src: "https://facebook.com",
      },
    };
    const result = await client.post({
      path: "script_tags",
      data,
      type: DataType.JSON,
    });
    return result.body;
  } catch (error) {
    return error;
  }
}
// Contoller for geting script tags
export async function getScriptTags(client, query) {
  if (!client) {
    throw new Error("Client didn't found");
  }
  try {
    const result = await client.get({
      path: "script_tags",
      query,
    });
    return result.body;
  } catch (error) {
    return error;
  }
}

export async function deleteScriptTags(client, scriptId) {
  if (!client) {
    throw new Error("Client didn't found");
  }
  try {
    const result = await client.delete({
      path: `script_tags/${scriptId}`,
    });
    return result.body;
  } catch (error) {
    return error;
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
