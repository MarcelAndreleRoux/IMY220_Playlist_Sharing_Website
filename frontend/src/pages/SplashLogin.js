import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export function SplashLogin({ users, setAuthenticatedUser }) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const validateUserInput = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const user = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          users.find(
            (user) =>
              user.email.toLowerCase() === email.toLowerCase() &&
              user.password === password
          )
        );
      }, 500);
    });

    if (user) {
      // Save the authenticated user to the app state and localStorage
      setAuthenticatedUser(user.username, user.email);
      localStorage.setItem("userId", user.userId);

      setSuccess("Login successful!");
      setError("");

      navigate("/home");
    } else {
      setError("Invalid email or password.");
      setSuccess("");
    }
  };

  const handleSocialLogin = async (platform) => {
    const defaultUser = {
      username: `${platform}_user`,
      email: `${platform}@example.com`,
    };

    setAuthenticatedUser(defaultUser.username, defaultUser.email);
    localStorage.setItem("userId", defaultUser.userId);

    setSuccess(`Logged in as ${platform}_user`);
    setError("");

    navigate("/home");
  };

  return (
    <div className="container mt-5">
      <h1>Login</h1>
      <p className="text-muted">
        <small>Login with social media</small>
      </p>
      <div className="d-flex justify-content-between mb-3">
        <button
          onClick={() => handleSocialLogin("Google")}
          className="btn btn-outline-primary"
        >
          Google
        </button>
        <button
          onClick={() => handleSocialLogin("Twitter")}
          className="btn btn-outline-info"
        >
          Twitter/X
        </button>
        <button
          onClick={() => handleSocialLogin("Facebook")}
          className="btn btn-outline-primary"
        >
          Facebook
        </button>
      </div>

      <p className="text-muted">
        <small>Login with credentials</small>
      </p>

      <form onSubmit={validateUserInput}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email here..."
            ref={emailRef}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Enter password here..."
              ref={passwordRef}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-success">
          Login
        </button>

        {error && (
          <div className="mt-3 alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-3 alert alert-success" role="alert">
            {success}
          </div>
        )}
      </form>

      <p className="mt-3">
        <small>
          Haven't created an account yet?{" "}
          <NavLink
            to="/register"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Sign Up
          </NavLink>
        </small>
      </p>
    </div>
  );
}
