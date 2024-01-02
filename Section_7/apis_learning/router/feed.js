const express = require("express");

const feedController = require("../controllers/feed");
const { checkCreatePostInput } = require("../helpers/validators");

const router = express.Router();

router.get("/posts", feedController.getPosts);

router.post("/create-post", checkCreatePostInput, feedController.createPost);

module.exports = router;
