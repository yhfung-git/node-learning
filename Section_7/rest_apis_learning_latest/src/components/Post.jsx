import React from "react";

import Button from "./Button";
import "./styles/Post.css";

const post = (props) => {
  const isCreator = props.currentUser === props.author._id;

  return (
    <article className="post">
      <header className="post__header">
        <h3 className="post__meta">
          Posted by {props.author.name} on {props.date}
        </h3>
        <h1 className="post__title">{props.title}</h1>
      </header>
      {/* <div className="post__image">
      <Image imageUrl={props.image} contain />
    </div>
    <div className="post__content">{props.content}</div> */}
      <div className="post__actions">
        <Button mode="flat" link={props.id}>
          View
        </Button>
        {isCreator && (
          <>
            <Button mode="flat" onClick={props.onStartEdit}>
              Edit
            </Button>
            <Button mode="flat" design="danger" onClick={props.onDelete}>
              Delete
            </Button>
          </>
        )}
      </div>
    </article>
  );
};

export default post;
