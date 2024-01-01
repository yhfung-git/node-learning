import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Image from "../../../components/Image";
import "./SinglePost.css";

const SinglePost = () => {
  const [post, setPost] = useState({
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  });

  const { postId } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`URL/${postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch status");
        }
        const resData = await response.json();
        setPost({
          title: resData.post.title,
          author: resData.post.creator.name,
          date: new Date(resData.post.createdAt).toLocaleDateString("en-US"),
          content: resData.post.content,
          image: resData.post.imageUrl, // assuming imageUrl is part of the response
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <section className="single-post">
      <h1>{post.title}</h1>
      <h2>
        Created by {post.author} on {post.date}
      </h2>
      <div className="single-post__image">
        <Image contain imageUrl={post.image} />
      </div>
      <p>{post.content}</p>
    </section>
  );
};

export default SinglePost;
