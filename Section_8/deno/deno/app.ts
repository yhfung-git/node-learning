// const port = 3000;
// const handler = (_req: Request): Response => new Response("Hello Deno!");

// Deno.serve({ port }, handler);

import { Application } from "https://deno.land/x/oak@v12.6.2/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello Oak!";
});

await app.listen({ port: 3000 });
