/* eslint-disable react/prop-types */
import React, { useState } from "react";

import Input from "../../components/Input";
import Button from "../../components/Button";
import { required, length, email } from "../../util/validators";
import Auth from "./Auth";

const Signup = (props) => {
  const [signupForm, setSignupForm] = useState({
    signupForm: {
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
      name: {
        value: "",
        valid: false,
        touched: false,
        validators: [required],
      },
    },
  });

  const inputChangeHandler = (input, value) => {
    setSignupForm((prevSignupForm) => {
      let isValid = true;
      for (const validator of prevSignupForm.signupForm[input].validators) {
        isValid = isValid && validator(value);
      }

      const updatedForm = {
        ...prevSignupForm.signupForm,
        [input]: {
          ...prevSignupForm.signupForm[input],
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
        signupForm: updatedForm,
        formIsValid: formIsValid,
      };
    });
  };

  const inputBlurHandler = (input) => {
    setSignupForm((prevSignupForm) => {
      return {
        signupForm: {
          ...prevSignupForm.signupForm,
          [input]: {
            ...prevSignupForm.signupForm[input],
            touched: true,
          },
        },
      };
    });
  };

  return (
    <Auth>
      <form onSubmit={(e) => props.onSignup(e, signupForm)}>
        <Input
          id="email"
          label="Your E-Mail"
          type="email"
          control="input"
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler("email")}
          value={signupForm.signupForm["email"].value}
          valid={signupForm.signupForm["email"].valid}
          touched={signupForm.signupForm["email"].touched}
        />
        <Input
          id="name"
          label="Your Name"
          type="text"
          control="input"
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler("name")}
          value={signupForm.signupForm["name"].value}
          valid={signupForm.signupForm["name"].valid}
          touched={signupForm.signupForm["name"].touched}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          control="input"
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler("password")}
          value={signupForm.signupForm["password"].value}
          valid={signupForm.signupForm["password"].valid}
          touched={signupForm.signupForm["password"].touched}
        />
        <Button design="raised" type="submit" loading={props.loading}>
          Signup
        </Button>
      </form>
    </Auth>
  );
};

export default Signup;
