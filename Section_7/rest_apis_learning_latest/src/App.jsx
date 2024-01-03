import React, { useState, useEffect, Fragment, useCallback } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import Layout from "./components/Layout";
import Backdrop from "./components/Backdrop";
import Toolbar from "./components/Toolbar";
import MainNavigation from "./components/MainNavigation";
import MobileNavigation from "./components/MobileNavigation";
import ErrorHandler from "./components/ErrorHandler";
import FeedPage from "./pages/Feed/Feed";
import SinglePostPage from "./pages/Feed/SinglePost/SinglePost";
import LoginPage from "./pages/auth/Login";
import SignupPage from "./pages/auth/Signup";
import "./App.css";

function App() {
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const logoutHandler = useCallback(() => {
    setIsAuth(false);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
  }, []);

  const setAutoLogout = useCallback(
    (milliseconds) => {
      setTimeout(function () {
        logoutHandler();
      }, milliseconds);
    },
    [logoutHandler]
  );

  useEffect(
    function componentDidMount() {
      const token = localStorage.getItem("token");
      const expiryDate = localStorage.getItem("expiryDate");

      if (!token || !expiryDate) {
        return;
      }

      if (new Date(expiryDate) <= new Date()) {
        logoutHandler();
        return;
      }

      const userId = localStorage.getItem("userId");
      const remainingMilliseconds =
        new Date(expiryDate).getTime() - new Date().getTime();

      setIsAuth(true);
      setToken(token);
      setUserId(userId);
      setAutoLogout(remainingMilliseconds);
    },
    [logoutHandler, setAutoLogout]
  );

  function mobileNavHandler(isOpen) {
    setShowMobileNav(isOpen);
    setShowBackdrop(isOpen);
  }

  function backdropClickHandler() {
    setShowBackdrop(false);
    setShowMobileNav(false);
    setError(null);
  }

  function loginHandler(event, authData) {
    event.preventDefault();
    setAuthLoading(true);

    fetch("URL")
      .then(function (res) {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Could not authenticate you!");
        }
        return res.json();
      })
      .then(function (resData) {
        console.log(resData);
        setIsAuth(true);
        setToken(resData.token);
        setAuthLoading(false);
        setUserId(resData.userId);

        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);

        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());

        setAutoLogout(remainingMilliseconds);
      })
      .catch(function (err) {
        console.log(err);
        setIsAuth(false);
        setAuthLoading(false);
        setError(err);
      });
  }

  function signupHandler(event, authData) {
    event.preventDefault();
    setAuthLoading(true);
    fetch("http://localhost:8080/auth/signup", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authData.signupForm.email.value,
        password: authData.signupForm.password.value,
        name: authData.signupForm.name.value,
      }),
    })
      .then(function (res) {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Creating a user failed!");
        }
        return res.json();
      })
      .then(function (resData) {
        console.log(resData);
        setIsAuth(false);
        setAuthLoading(false);
        navigate("/");
      })
      .catch(function (err) {
        console.log(err);
        setIsAuth(false);
        setAuthLoading(false);
        setError(err);
      });
  }

  function errorHandler() {
    setError(null);
  }

  const routes = isAuth ? (
    <Routes>
      <Route
        path="/"
        exact
        element={<FeedPage userId={userId} token={token} />}
      />
      <Route
        path="/:postId"
        element={<SinglePostPage userId={userId} token={token} />}
      />
      <Route element={<Navigate to="/" />} />
    </Routes>
  ) : (
    <Routes>
      <Route
        path="/"
        exact
        element={<LoginPage onLogin={loginHandler} loading={authLoading} />}
      />
      <Route
        path="/signup"
        exact
        element={<SignupPage onSignup={signupHandler} loading={authLoading} />}
      />
      <Route element={<Navigate to="/" />} />
    </Routes>
  );

  return (
    <Fragment>
      {showBackdrop && <Backdrop onClick={backdropClickHandler} />}
      <ErrorHandler error={error} onHandle={errorHandler} />
      <Layout
        header={
          <Toolbar>
            <MainNavigation
              onOpenMobileNav={function () {
                mobileNavHandler(true);
              }}
              onLogout={logoutHandler}
              isAuth={isAuth}
            />
          </Toolbar>
        }
        mobileNav={
          <MobileNavigation
            open={showMobileNav}
            mobile
            onChooseItem={function () {
              mobileNavHandler(false);
            }}
            onLogout={logoutHandler}
            isAuth={isAuth}
          />
        }
      />
      {routes}
    </Fragment>
  );
}

export default App;
