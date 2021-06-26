import Router from "koa-router";
import {
  createScriptTag,
  getScriptTags,
  deleteScriptTags,
} from "../controller/scriptTag_controller";
const router = new Router({ prefix: "/script_tags" });

// Route for get all script tags
router.get("/", getScriptTags);
// Route for create script tags
router.post("/", createScriptTag);
// Route for delete an script tag by id
router.delete("/:scriptId", deleteScriptTags);

export default router;
