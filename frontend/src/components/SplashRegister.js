import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Google_Logo from "../../public/assets/images/Google.jpg";
// import X_Logo from "../../public/assets/images/X.png";
// import Facebook_Logo from "../../public/assets/images/facebook.png";

export function SplashRegister() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const RegisterInputUsername = useRef(null);
  const RegisterInputEmail = useRef(null);
  const RegisterInputPassword = useRef(null);
  const RegisterInputConfirmPassword = useRef(null);

  const validateUserInput = (e) => {
    e.preventDefault();

    const username = RegisterInputUsername.current.value;
    const email = RegisterInputEmail.current.value;
    const password = RegisterInputPassword.current.value;
    const confirmPassword = RegisterInputConfirmPassword.current.value;

    // Basic validation (e.g., check if fields are not empty)
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

    navigate("/login");
  };

  return (
    <div>
      <h1>Register</h1>
      <br />
      <p>
        <small>Sign up with social media</small>
      </p>
      <div className="social-buttons">
        <button>
          <Link to="/login">
            {/* <img width={100} src={Google_Logo} alt="Google logo" /> */}
            Google
          </Link>
        </button>
        <button>
          <Link to="/login">
            {/* <img width={100} src={X_Logo} alt="X logo" /> */}Twitter/X
          </Link>
        </button>
        <button>
          <Link to="/login">
            {/* <img width={100} src={Facebook_Logo} alt="Facebook logo" /> */}
            Facebook
          </Link>
        </button>
      </div>
      <br />
      <p>
        <small>Sign up with your details</small>
      </p>
      <form onSubmit={validateUserInput}>
        <input
          type="text"
          ref={RegisterInputUsername}
          placeholder="Enter username here..."
        />
        <br />
        <input
          type="email"
          ref={RegisterInputEmail}
          placeholder="Enter email here..."
        />
        <br />
        <input
          type="password"
          ref={RegisterInputPassword}
          placeholder="Enter password here..."
        />
        <br />
        <input
          type="password"
          ref={RegisterInputConfirmPassword}
          placeholder="Confirm your password..."
        />
        <br />
        <input type="submit" value="Sign Up" />
      </form>
      {error && <small style={{ color: "red" }}>{error}</small>}
      <p>
        <small>
          Already have an account? <Link to="/login">Log In</Link>
        </small>
      </p>
    </div>
  );
}
