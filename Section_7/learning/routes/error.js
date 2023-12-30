const express = require("express");

const router = express.Router();

const errorsController = require("../controllers/errors");

router.get("/500", errorsController.error500);

router.use(errorsController.error404);

module.exports = router;
