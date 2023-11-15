const path = require("path");

const express = require("express");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.use(express.urlencoded({ extended: true })); // To handle parsing incoming requests
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);

// NOTES

// app.get('/favicon.ico', (req, res) => res.status(204)); To prevent the favicon request from the root of the server "/".

// app.use("/", (req, res, next) => {
//   console.log("This always run!");
//   next(); // Allows the request to continue to the next middleware in line, if we don't plan to send the response here
// });

// app.get("/users", (req, res, next) => {
//   res.send("<h1>User List!</h1>");
// });

// app.use = handles any incoming requests that begin with the path
// app.get = GET method, app.post = POST method, etc...