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

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const { user } = await response.json();

      // Set cookie first with MongoDB _id
      setCookie("userId", user._id, 1);

      // Then set session storage
      sessionStorage.setItem("authenticatedUser", JSON.stringify(user));

      // Update context
      setAuthenticatedUser(user);

      setSuccess("Login successful!");
      setError("");

      setTimeout(() => {
        const userId = getCookie("userId");
        if (userId) {
          navigate("/home");
        }
      }, 500);
    } catch (err) {
      setError(err.message);
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

  useEffect(() => {
    // Check for auto-fill data from registration
    const lastEmail = sessionStorage.getItem("lastRegisteredEmail");
    const lastPassword = sessionStorage.getItem("lastRegisteredPassword");

    if (lastEmail && lastPassword && emailRef.current && passwordRef.current) {
      emailRef.current.value = lastEmail;
      passwordRef.current.value = lastPassword;

      // Clear stored credentials
      sessionStorage.removeItem("lastRegisteredEmail");
      sessionStorage.removeItem("lastRegisteredPassword");
    }
  }, []);

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
