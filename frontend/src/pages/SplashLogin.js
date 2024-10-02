import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import SocialLoginButtons from "../components/SocialLoginButtons";

const SplashLogin = () => {
  return (
    <div className="container mt-5">
      <h1>Login</h1>
      <p className="text-muted">
        <small>Login with social media</small>
      </p>
      <SocialLoginButtons />
      <p className="text-muted">
        <small>Login with credentials</small>
      </p>
      <LoginForm />
      <p className="mt-3">
        <small>
          Haven't created an account yet?
          <Link to="/register">Sign Up</Link>
        </small>
      </p>
    </div>
  );
};

export default SplashLogin;
