/* eslint-disable react/prop-types */
import React, { useState } from "react";

import Input from "../../components/Input";
import Button from "../../components/Button";
import { required, length, email } from "../../util/validators";
import Auth from "./Auth";

const Login = (props) => {
  const [loginForm, setLoginForm] = useState({
    loginForm: {
      email: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, email],
      },
      password: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })],
      },
    },
  });

  const inputChangeHandler = (input, value) => {
    setLoginForm((prevLoginForm) => {
      let isValid = true;
      for (const validator of prevLoginForm.loginForm[input].validators) {
        isValid = isValid && validator(value);
      }

      const updatedForm = {
        ...prevLoginForm.loginForm,
        [input]: {
          ...prevLoginForm.loginForm[input],
          valid: isValid,
          value: value,
          touched: true,
        },
      };

      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }

      return {
        loginForm: updatedForm,
        formIsValid: formIsValid,
      };
    });
  };

  const inputBlurHandler = (input) => {
    setLoginForm((prevLoginForm) => {
      return {
        loginForm: {
          ...prevLoginForm.loginForm,
          [input]: {
            ...prevLoginForm.loginForm[input],
            touched: true,
          },
        },
      };
    });
  };

  return (
    <Auth>
      <form onSubmit={(e) => props.onLogin(e, loginForm)}>
        <Input
          id="email"
          label="Your E-Mail"
          type="email"
          control="input"
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler("email")}
          value={loginForm.loginForm["email"].value}
          valid={loginForm.loginForm["email"].valid}
          touched={loginForm.loginForm["email"].touched}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          control="input"
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler("password")}
          value={loginForm.loginForm["password"].value}
          valid={loginForm.loginForm["password"].valid}
          touched={loginForm.loginForm["password"].touched}
        />
        <Button design="raised" type="submit" loading={props.loading}>
          Login
        </Button>
      </form>
    </Auth>
  );
};

export default Login;
