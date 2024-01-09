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
        const graphqlQuery = {
          query: `
            {
              getPost(postId: "${postId}") {
                title
                imageUrl
                content
                creator { name _id }
                createdAt
              }
            }
          `,
        };
        const response = await fetch("http://localhost:8080/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(graphqlQuery),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch the post");
        }

        const resData = await response.json();
        const { title, content, imageUrl, creator, createdAt } =
          resData.data.getPost;

        setPost({
          title: title,
          content: content,
          author: creator.name,
          image: `http://localhost:8080/${imageUrl}`,
          date: new Date(createdAt).toLocaleDateString("en-US"),
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
