import React from "react";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

const SplashRegister = () => {
  return (
    <div className="container mt-5">
      <h1>Register</h1>
      <p className="text-muted">
        <small>Sign up with your details</small>
      </p>

      <RegisterForm />

      <p className="mt-3">
        <small>
          Already have an account? <Link to="/login">Log In</Link>
        </small>
      </p>
    </div>
  );
};

export default SplashRegister;
