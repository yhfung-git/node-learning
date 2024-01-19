import { Application } from "https://deno.land/x/oak@v12.6.2/mod.ts";
import { green, yellow } from "https://deno.land/std@0.181.0/fmt/colors.ts";

import todosRoutes from "./routes/todos.ts";
import { connectDb } from "./helpers/db_client.ts";

await connectDb();
const app = new Application();
const port = 8000;

app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE"
  );
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  await next();
});

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${"localhost" ?? hostname}:${port}/`;
  console.log(`${yellow("Server is listening on:")} ${green(url)}`);
});

await app.listen({ port });
