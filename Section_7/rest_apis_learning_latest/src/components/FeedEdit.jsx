/* eslint-disable react/prop-types */
import React, { useState, useEffect, Fragment } from "react";
import Backdrop from "./Backdrop";
import Modal from "./Modal";
import Input from "./Input";
import FilePicker from "./FilePicker";
import Image from "./Image";
import { required, length } from "../util/validators";
import { generateBase64FromImage } from "../util/image";

const POST_FORM = {
  title: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })],
  },
  image: {
    value: "",
    valid: false,
    touched: false,
    validators: [required],
  },
  content: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })],
  },
};

const FeedEdit = (props) => {
  const [postForm, setPostForm] = useState(POST_FORM);
  const [formIsValid, setFormIsValid] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (props.editing && props.selectedPost) {
      const updatedPostForm = {
        title: {
          ...postForm.title,
          value: props.selectedPost.title,
          valid: true,
        },
        image: {
          ...postForm.image,
          value: props.selectedPost.imagePath,
          valid: true,
        },
        content: {
          ...postForm.content,
          value: props.selectedPost.content,
          valid: true,
        },
      };
      setPostForm(updatedPostForm);
      setFormIsValid(true);
    }
  }, [
    postForm.content,
    postForm.image,
    postForm.title,
    props.editing,
    props.selectedPost,
  ]);

  const postInputChangeHandler = (input, value, files) => {
    if (files) {
      generateBase64FromImage(files[0])
        .then((b64) => setImagePreview(b64))
        .catch(() => setImagePreview(null));
    }

    setPostForm((prevState) => {
      let isValid = true;
      for (const validator of prevState.postForm[input].validators) {
        isValid = isValid && validator(value);
      }

      const updatedForm = {
        ...prevState.postForm,
        [input]: {
          ...prevState.postForm[input],
          valid: isValid,
          value: files ? files[0] : value,
        },
      };

      let updatedFormIsValid = true;
      for (const inputName in updatedForm) {
        updatedFormIsValid = updatedFormIsValid && updatedForm[inputName].valid;
      }

      setFormIsValid(updatedFormIsValid);
      return updatedForm;
    });
  };

  const inputBlurHandler = (input) => {
    setPostForm((prevState) => ({
      ...prevState.postForm,
      [input]: {
        ...prevState.postForm[input],
        touched: true,
      },
    }));
  };

  const cancelPostChangeHandler = () => {
    setPostForm(POST_FORM);
    setFormIsValid(false);
    props.onCancelEdit();
  };

  const acceptPostChangeHandler = () => {
    const post = {
      title: postForm.title.value,
      image: postForm.image.value,
      content: postForm.content.value,
    };

    props.onFinishEdit(post);
    setPostForm(POST_FORM);
    setFormIsValid(false);
    setImagePreview(null);
  };

  return props.editing ? (
    <Fragment>
      <Backdrop onClick={cancelPostChangeHandler} />
      <Modal
        title="New Post"
        acceptEnabled={formIsValid}
        onCancelModal={cancelPostChangeHandler}
        onAcceptModal={acceptPostChangeHandler}
        isLoading={props.loading}
      >
        <form>
          <Input
            id="title"
            label="Title"
            control="input"
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler("title")}
            valid={postForm.title.valid}
            touched={postForm.title.touched}
            value={postForm.title.value}
          />
          <FilePicker
            id="image"
            label="Image"
            control="input"
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler("image")}
            valid={postForm.image.valid}
            touched={postForm.image.touched}
          />
          <div className="new-post__preview-image">
            {!imagePreview && <p>Please choose an image.</p>}
            {imagePreview && <Image imageUrl={imagePreview} contain left />}
          </div>
          <Input
            id="content"
            label="Content"
            control="textarea"
            rows="5"
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler("content")}
            valid={postForm.content.valid}
            touched={postForm.content.touched}
            value={postForm.content.value}
          />
        </form>
      </Modal>
    </Fragment>
  ) : null;
};

export default FeedEdit;
