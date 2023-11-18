const path = require("path");

const express = require("express");
const expressLayout = require("express-ejs-layouts");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main-layout");

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found", path: null });
});

app.listen(3000);
