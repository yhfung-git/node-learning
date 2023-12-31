exports.getPosts = async (req, res, next) => {
  try {
    res.status(200).json({
      posts: [
        { title: "First Post", content: "This is the FIRST post!" },
        { title: "Second Post", content: "This is the SECOND post!" },
      ],
    });
  } catch (err) {
    console.error(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    res.status(201).json({
      message: "Post created successfully!",
      post: { id: Date.now(), title, content },
    });
  } catch (err) {
    console.error(err);
  }
};
