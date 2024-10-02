import React, { useState, useRef, useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { users, setAuthenticatedUser } = useContext(PlaylistContext); // Should get a flat array now
  console.log("Users from Context: ", users);

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

    const email = emailRef.current.value.trim(); // Trim user input
    const password = passwordRef.current.value.trim(); // Trim user input

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    console.log("Entered Email: ", email);
    console.log("Entered Password: ", password);

    // Check if users is an array and has a valid length
    if (!Array.isArray(users) || users.length === 0) {
      setError("No users found.");
      return;
    }

    const user = users.find(
      (user) =>
        user?.email?.toLowerCase() === email.toLowerCase() &&
        user?.password === password
    );

    if (user) {
      setAuthenticatedUser(user.username, user.email, user.userId);
      localStorage.setItem("userId", user.userId);

      setSuccess("Login successful!");
      setError("");
      navigate("/home");
    } else {
      setError("Invalid email or password.");
      setSuccess("");
    }
  };

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
