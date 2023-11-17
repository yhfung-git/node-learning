const path = require("path");

const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();

const userRoutes = require("./routes/user");
const mainRoutes = require("./routes/main");

app.set("view engine", "ejs");
app.set("layout", "./layouts/layout");
app.use(expressLayouts);

// to handle incoming requests
app.use(express.urlencoded({ extended: true }));

// to handle static files requests like JS, CSS, Images, etc...
app.use(express.static(path.join(__dirname, "public")));

app.use(userRoutes);
app.use(mainRoutes.routes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found", path: null });
});

app.listen(3000);
