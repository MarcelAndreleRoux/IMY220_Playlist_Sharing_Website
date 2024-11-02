import React, { useRef, useState, useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const { users, setUsers, setAuthenticatedUser } = useContext(PlaylistContext);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [error, setError] = useState("");
  const [formValid, setFormValid] = useState(false);

  const navigate = useNavigate();

  const validateUserInput = async (e) => {
    e.preventDefault();

    const username = usernameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    const confirmPassword = confirmPasswordRef.current.value.trim();

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
      setError("Email already exists. Please use another email.");
      return;
    }

    try {
      const newUser = {
        username,
        email,
        password,
        friends: [],
        profilePic:
          "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
        playlists: [],
        created_playlists: [],
      };

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const savedUser = await response.json();
      setUsers([...users, savedUser.result]);

      const { password: _, ...userWithoutPassword } = savedUser.result;

      sessionStorage.setItem(
        "authenticatedUser",
        JSON.stringify(userWithoutPassword)
      );

      setAuthenticatedUser(userWithoutPassword);
      setFormValid(true);
      setError("");
      navigate("/login");
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <form onSubmit={validateUserInput}>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          type="text"
          className="form-control"
          id="username"
          ref={usernameRef}
          placeholder="Enter username here..."
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          ref={emailRef}
          placeholder="Enter email here..."
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          ref={passwordRef}
          placeholder="Enter password here..."
        />
      </div>

      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password
        </label>
        <input
          type="password"
          className="form-control"
          id="confirmPassword"
          ref={confirmPasswordRef}
          placeholder="Confirm your password..."
        />
      </div>

      <div>
        <button type="submit" className="btn btn-success">
          Register
        </button>
        {formValid && <p className="text-success">Registration successful!</p>}
      </div>

      {error && (
        <div className="mt-3 alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </form>
  );
};

export default RegisterForm;
