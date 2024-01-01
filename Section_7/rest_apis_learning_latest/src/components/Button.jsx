/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";

import "./styles/Button.css";

const Button = (props) => {
  const buttonClasses = `button button--${props.design} button--${props.mode}`;

  return !props.link ? (
    <button
      className={buttonClasses}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
      type={props.type}
    >
      {props.loading ? "Loading..." : props.children}
    </button>
  ) : (
    <Link className={buttonClasses} to={props.link}>
      {props.children}
    </Link>
  );
};

export default Button;
