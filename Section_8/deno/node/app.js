const express = require("express");

const todosRoutes = require("./routes/todos");

const app = express();

app.use(express.json());

app.use(todosRoutes);

app.listen(3000, () => {
  console.log("Server is listening on port 3000!");
});
