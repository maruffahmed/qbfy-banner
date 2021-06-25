import Router from "koa-router";
import {
  createScriptTag,
  getScriptTags,
  deleteScriptTags,
} from "../controller/script_tag_controller";
const router = new Router({ prefix: "/script_tags" });

// Route for get all script tags
router.get("/", async (ctx) => {
  const query = ctx.query;
  const { myClient } = ctx;
  const result = await getScriptTags(myClient, query);
  if (result.script_tags) {
    ctx.body = result;
  } else {
    ctx.body = { error: result.message };
  }
});

router.post("/", async (ctx) => {
  const { myClient } = ctx;
  // Call the controller
  const result = await createScriptTag(myClient);
  // Give response
  if (result.script_tag) {
    ctx.body = result;
  } else {
    ctx.body = { error: result.message };
  }
});

// Route for delete an script tag by id
router.delete("/:scriptId", async (ctx) => {
  const { scriptId } = ctx.params;
  const { myClient } = ctx;
  const result = await deleteScriptTags(myClient, scriptId);
  if (typeof result === "string") {
    ctx.body = { error: result.message };
  } else {
    ctx.body = { message: "Script tag delete successfully" };
  }
});

export default router;
