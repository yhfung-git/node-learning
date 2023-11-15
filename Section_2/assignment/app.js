const path = require("path");

const express = require("express");

const userRoutes = require("./routes/user");
const mainRoutes = require("./routes/main");

const app = express();

// to handle incoming requests
app.use(express.urlencoded({ extended: true }));

// to handle static files requests like JS, CSS, Images, etc...
app.use(express.static(path.join(__dirname, "public")));

app.use(userRoutes);
app.use(mainRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);
