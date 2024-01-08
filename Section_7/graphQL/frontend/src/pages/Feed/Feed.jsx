import React, { useState, useEffect, Fragment } from "react";

import Post from "../../components/Post";
import Button from "../../components/Button";
import FeedEdit from "../../components/FeedEdit";
import Input from "../../components/Input";
import Paginator from "../../components/Paginator";
import Loader from "../../components/Loader";
import ErrorHandler from "../../components/ErrorHandler";
import "./Feed.css";

const Feed = ({ userId, token }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [editPost, setEditPost] = useState(null);
  const [status, setStatus] = useState("");
  const [postPage, setPostPage] = useState(1);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/user/status/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user status.");
        }
        const resData = await response.json();
        setStatus(resData.status);
      } catch (error) {
        catchError(error);
      }
    };

    fetchUserStatus();
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadPosts = (direction) => {
    if (direction) {
      setPostsLoading(true);
      setPosts([]);
    }

    let page = postPage;

    if (direction === "next") page++;

    if (direction === "previous") page--;

    setPostPage(page);
    setCurrentPage(page);

    fetch(`http://localhost:8080/feed/posts?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch posts.");
        }
        return res.json();
      })
      .then((resData) => {
        setPosts(
          resData.posts.map((post) => ({
            ...post,
            imagePath: post.imageUrl,
            key: post._id,
          }))
        );
        setTotalPosts(resData.totalItems);
        setPostsLoading(false);
      })
      .catch(catchError);
  };

  const statusUpdateHandler = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8080/user/status/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch(catchError);
  };

  const newPostHandler = () => {
    setIsEditing(true);
  };

  const startEditPostHandler = (postId) => {
    const loadedPost = { ...posts.find((p) => p._id === postId) };
    setIsEditing(true);
    setEditPost(loadedPost);
  };

  const cancelEditHandler = () => {
    setIsEditing(false);
    setEditPost(null);
  };

  const finishEditHandler = (postData) => {
    setEditLoading(true);

    // const formData = new FormData();
    // formData.append("title", postData.title);
    // formData.append("content", postData.content);
    // formData.append("image", postData.image);

    let graphqlQuery = {
      query: `
        mutation {
          createPost(
            postInput: {
              title: "${postData.title}",
              content: "${postData.content}",
              imageUrl: "images/1704491613933-0baaaa1bcfd14aa18ea131f261ff976e.jpeg"
            }
          ) {
            _id
            title
            content
            imageUrl
            creator { name }
            createdAt
          }
        }
      `,
    };

    fetch("http://localhost:8080/graphql", {
      method: "POST",
      body: JSON.stringify(graphqlQuery),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          const errorMessage = resData.errors[0].message;
          throw new Error(errorMessage);
        }

        if (!resData.data || !resData.data.createPost) {
          throw new Error("Failed to create post!");
        }

        console.log(resData);
        // const post = {
        //   _id: resData.data.createPost._id,
        //   title: resData.data.createPost.title,
        //   content: resData.data.createPost.content,
        //   creator: resData.data.createPost.creator,
        //   createdAt: resData.data.createPost.createdAt,
        // };
        setIsEditing(false);
        setEditPost(null);
        setEditLoading(false);
        loadPosts();
      })
      .catch((err) => {
        console.log(err);
        setIsEditing(false);
        setEditPost(null);
        setEditLoading(false);
        catchError(err);
      });
  };

  const statusInputChangeHandler = (input, value) => {
    setStatus(value);
  };

  const deletePostHandler = (postId) => {
    setPostsLoading(true);
    fetch(`http://localhost:8080/feed/post/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Deleting a post failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setPostsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setPostsLoading(false);
      });
  };

  const errorHandler = () => {
    setError(null);
  };

  const catchError = (err) => {
    setError(err);
  };

  return (
    <Fragment>
      <ErrorHandler error={error} onHandle={errorHandler} />
      <FeedEdit
        editing={isEditing}
        selectedPost={editPost}
        loading={editLoading}
        onCancelEdit={cancelEditHandler}
        onFinishEdit={finishEditHandler}
      />
      <section className="feed__status">
        <form onSubmit={statusUpdateHandler}>
          <Input
            type="text"
            placeholder="Your status"
            control="input"
            onChange={statusInputChangeHandler}
            value={status}
          />
          <Button mode="flat" type="submit">
            Update
          </Button>
        </form>
      </section>
      <section className="feed__control">
        <Button mode="raised" design="accent" onClick={newPostHandler}>
          New Post
        </Button>
      </section>
      <section className="feed">
        {postsLoading && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Loader />
          </div>
        )}
        {posts.length <= 0 && !postsLoading ? (
          <p style={{ textAlign: "center" }}>No posts found.</p>
        ) : null}
        {!postsLoading && (
          <Paginator
            onPrevious={() => loadPosts("previous")}
            onNext={() => loadPosts("next")}
            lastPage={Math.ceil(totalPosts / 3)}
            currentPage={postPage}
          >
            {posts.map((post) => (
              <Post
                key={post._id}
                id={post._id}
                author={post.creator}
                currentUser={userId}
                date={new Date(post.createdAt).toLocaleDateString("en-US")}
                title={post.title}
                image={post.imageUrl}
                content={post.content}
                onStartEdit={() => startEditPostHandler(post._id)}
                onDelete={() => deletePostHandler(post._id)}
              />
            ))}
          </Paginator>
        )}
      </section>
    </Fragment>
  );
};

export default Feed;
