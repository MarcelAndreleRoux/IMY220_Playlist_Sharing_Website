import React, { useState, useRef, useContext, useEffect } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import { useNavigate } from "react-router-dom";
import { setCookie, getCookie } from "../utils/utils";

const LoginForm = () => {
  const { users, setAuthenticatedUser } = useContext(PlaylistContext);

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
    setError("");

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!Array.isArray(users) || users.length === 0) {
      setError("No users found.");
      return;
    }

    const user = users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;

      // Set cookie first
      setCookie("userId", userWithoutPassword.userId, 1);

      // Then set session storage
      sessionStorage.setItem(
        "authenticatedUser",
        JSON.stringify(userWithoutPassword)
      );

      // Update context
      setAuthenticatedUser(userWithoutPassword);

      setSuccess("Login successful!");
      setError("");

      // Add a longer delay and check auth state before navigating
      setTimeout(() => {
        const userId = getCookie("userId");
        console.log("About to navigate, userId:", userId);
        if (userId) {
          navigate("/home");
        } else {
          console.error("Cookie not set properly");
        }
      }, 500);
    } else {
      setError("Invalid email or password.");
      setSuccess("");
    }
  };

  // If user is already authenticated, redirect to home
  useEffect(() => {
    const sessionUser = sessionStorage.getItem("authenticatedUser");
    const userId = getCookie("userId");

    if (sessionUser && userId) {
      navigate("/home");
    }
  }, [navigate]);

  return (
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
  );
};

export default LoginForm;
