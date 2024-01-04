const express = require("express");

const statusController = require("../controllers/user");
const { checkStatusInput } = require("../helpers/validators");

const router = express.Router();

router.get("/status/:userId", statusController.status);

router.put("/status/:userId", checkStatusInput, statusController.updateStatus);

module.exports = router;
