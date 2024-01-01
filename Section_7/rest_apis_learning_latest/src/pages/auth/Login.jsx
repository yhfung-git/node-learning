/* eslint-disable react/prop-types */
import React, { useState, useCallback } from 'react';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';

const Login = (props) => {
  const [loginForm, setLoginForm] = useState({
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
    formIsValid: false,
  });

  const inputChangeHandler = useCallback((input, value) => {
    setLoginForm((prevLoginForm) => {
      let isValid = true;
      for (const validator of prevLoginForm[input].validators) {
        isValid = isValid && validator(value);
      }

      const updatedForm = {
        ...prevLoginForm,
        [input]: {
          ...prevLoginForm[input],
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
      setLoginForm((prevLoginForm) => {
        return {
          ...prevLoginForm,
          [input]: {
            ...prevLoginForm[input],
            touched: true,
          },
        };
      });
    },
    []
  );

  return (
    <Auth>
      <form
        onSubmit={(e) =>
          props.onLogin(e, {
            email: loginForm.email.value,
            password: loginForm.password.value,
          })
        }
      >
        <Input
          id="email"
          label="Your E-Mail"
          type="email"
          control="input"
          onChange={(value) => inputChangeHandler('email', value)}
          onBlur={() => inputBlurHandler('email')}
          value={loginForm.email.value}
          valid={loginForm.email.valid}
          touched={loginForm.email.touched}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          control="input"
          onChange={(value) => inputChangeHandler('password', value)}
          onBlur={() => inputBlurHandler('password')}
          value={loginForm.password.value}
          valid={loginForm.password.valid}
          touched={loginForm.password.touched}
        />
        <Button design="raised" type="submit" loading={props.loading}>
          Login
        </Button>
      </form>
    </Auth>
  );
};

export default Login;
