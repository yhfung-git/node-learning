import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Image from "../../../components/Image";
import "./SinglePost.css";

const SinglePost = ({ userId, token }) => {
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
        const response = await fetch(
          `http://localhost:8080/feed/post/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch status");
        }
        const resData = await response.json();
        setPost({
          title: resData.post.title,
          author: resData.post.creator.name,
          date: new Date(resData.post.createdAt).toLocaleDateString("en-US"),
          content: resData.post.content,
          image: `http://localhost:8080/${resData.post.imageUrl}`,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [postId, token]);

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
