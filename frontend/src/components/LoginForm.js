import React, { useState, useRef, useContext, useEffect } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../utils/utils";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
  const { setAuthenticatedUser } = useContext(PlaylistContext);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid email or password");

      const { user } = await response.json();
      setCookie("userId", user._id, 1);
      sessionStorage.setItem("authenticatedUser", JSON.stringify(user));
      setAuthenticatedUser(user);
      setSuccess("Login successful!");
      setTimeout(() => navigate("/home"), 500);
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <form
      onSubmit={validateUserInput}
      className="bg-gray-800 p-8 rounded-lg shadow-md text-white"
    >
      <h2 className="text-3xl font-semibold text-yellow-400 mb-4 text-center">
        Login
      </h2>
      <p className="text-center text-gray-400 mb-6">Welcome back to MUZIK</p>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email here..."
          ref={emailRef}
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
            placeholder="Enter password here..."
            ref={passwordRef}
            className="w-full p-3 mt-1 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-500 hover:bg-yellow-600 p-3 rounded mt-4 text-gray-900 font-semibold"
      >
        Login
      </button>

      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      {success && (
        <div className="mt-4 text-green-500 text-center">{success}</div>
      )}
    </form>
  );
};

export default LoginForm;
