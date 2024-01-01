/* eslint-disable react/prop-types */
import React, { useState, useCallback } from 'react';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';

const Signup = (props) => {
  const [signupForm, setSignupForm] = useState({
    email: {
      value: '',
      valid: false,
      touched: false,
      validators: [required, email],
    },
    password: {
      value: '',
      valid: false,
      touched: false,
      validators: [required, length({ min: 5 })],
    },
    name: {
      value: '',
      valid: false,
      touched: false,
      validators: [required],
    },
    formIsValid: false,
  });

  const inputChangeHandler = useCallback((input, value) => {
    setSignupForm((prevSignupForm) => {
      let isValid = true;
      for (const validator of prevSignupForm[input].validators) {
        isValid = isValid && validator(value);
      }

      const updatedForm = {
        ...prevSignupForm,
        [input]: {
          ...prevSignupForm[input],
          valid: isValid,
          value: value,
        },
      };

      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }

      return {
        ...updatedForm,
        formIsValid: formIsValid,
      };
    });
  }, []);

  const inputBlurHandler = useCallback(
    (input) => {
      setSignupForm((prevSignupForm) => {
        return {
          ...prevSignupForm,
          [input]: {
            ...prevSignupForm[input],
            touched: true,
          },
        };
      });
    },
    []
  );

  return (
    <Auth>
      <form onSubmit={(e) => props.onSignup(e, signupForm)}>
        <Input
          id="email"
          label="Your E-Mail"
          type="email"
          control="input"
          onChange={(value) => inputChangeHandler('email', value)}
          onBlur={() => inputBlurHandler('email')}
          value={signupForm.email.value}
          valid={signupForm.email.valid}
          touched={signupForm.email.touched}
        />
        <Input
          id="name"
          label="Your Name"
          type="text"
          control="input"
          onChange={(value) => inputChangeHandler('name', value)}
          onBlur={() => inputBlurHandler('name')}
          value={signupForm.name.value}
          valid={signupForm.name.valid}
          touched={signupForm.name.touched}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          control="input"
          onChange={(value) => inputChangeHandler('password', value)}
          onBlur={() => inputBlurHandler('password')}
          value={signupForm.password.value}
          valid={signupForm.password.valid}
          touched={signupForm.password.touched}
        />
        <Button design="raised" type="submit" loading={props.loading}>
          Signup
        </Button>
      </form>
    </Auth>
  );
};

export default Signup;
