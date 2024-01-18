import { Router } from "https://deno.land/x/oak@v12.6.2/mod.ts";

import todosController from "../controllers/todos.ts";

const router = new Router({ prefix: "/todos" });

router
  .get("/", todosController.index)
  .post("/create", todosController.create)
  .put("/update/:todoId", todosController.update)
  .delete("/delete/:todoId", todosController.destroy);

export default router;
