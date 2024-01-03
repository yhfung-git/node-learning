const express = require("express");

const feedController = require("../controllers/feed");
const {
  checkCreatePostInput,
  checkUpdatePostInput,
} = require("../helpers/validators");

const router = express.Router();

router.get("/posts", feedController.getPosts);

router.get("/post/:postId", feedController.getPost);

router.post("/create-post", checkCreatePostInput, feedController.createPost);

router.put("/post/:postId", checkUpdatePostInput, feedController.updatePost);

router.delete("/post/:postId", feedController.deletePost);

module.exports = router;
