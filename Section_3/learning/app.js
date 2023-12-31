const path = require("path");

const express = require("express");
const expressLayout = require("express-ejs-layouts");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorsController = require("./controllers/errors");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main-layout");

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.error404);

app.listen(3000);
