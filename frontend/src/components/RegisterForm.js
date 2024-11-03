import React, { useRef, useState, useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterForm = () => {
  const { users, setUsers, setAuthenticatedUser } = useContext(PlaylistContext);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [error, setError] = useState("");
  const [formValid, setFormValid] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      const { result } = await response.json();
      setUsers((prevUsers) => [...prevUsers, result]);

      // Auto-fill login form through local storage
      sessionStorage.setItem("lastRegisteredEmail", email);
      sessionStorage.setItem("lastRegisteredPassword", password);

      setFormValid(true);
      setError("");
      navigate("/login");
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <form
      onSubmit={validateUserInput}
      className="bg-gray-800 p-8 rounded-lg shadow-md text-white"
    >
      <h2 className="text-3xl font-semibold text-yellow-400 mb-4 text-center">
        Register
      </h2>
      <p className="text-center text-gray-400 mb-6">Create a new account</p>

      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-300">
          Username
        </label>
        <input
          type="text"
          id="username"
          ref={usernameRef}
          placeholder="Enter username here..."
          className="w-full p-3 mt-1 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          ref={emailRef}
          placeholder="Enter email here..."
          className="w-full p-3 mt-1 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-300">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            ref={passwordRef}
            placeholder="Enter password here..."
            className="w-full p-3 mt-1 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-gray-300">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            ref={confirmPasswordRef}
            placeholder="Confirm your password..."
            className="w-full p-3 mt-1 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-500 hover:bg-yellow-600 p-3 rounded mt-4 text-gray-900 font-semibold"
      >
        Register
      </button>

      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      {formValid && (
        <p className="mt-4 text-green-500 text-center">
          Registration successful!
        </p>
      )}
    </form>
  );
};

export default RegisterForm;
