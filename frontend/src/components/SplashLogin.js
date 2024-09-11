import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Google_Logo from "../../public/assets/images/Google.jpg";
// import X_Logo from "../../public/assets/images/X.png";
// import Facebook_Logo from "../../public/assets/images/facebook.png";

export function SplashLogin({ users, setAuthenticatedUser }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const LoginInputEmail = useRef(null);
  const LoginInputPassword = useRef(null);

  const validateUserInput = (e) => {
    e.preventDefault();

    const email = LoginInputEmail.current.value;
    const password = LoginInputPassword.current.value;

    const username = email.split("@")[0];

    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      setAuthenticatedUser(username, email);
      navigate("/home");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <br />
      <p>
        <small>Login with social media</small>
      </p>
      <div className="social-buttons">
        <button>
          <Link to="/home">
            {/* <img width={100} src={Google_Logo} alt="Google logo" /> */}
            Google
          </Link>
        </button>
        <button>
          <Link to="/home">
            {/* <img width={100} src={X_Logo} alt="X logo" /> */}Twitter/X
          </Link>
        </button>
        <button>
          <Link to="/home">
            {/* <img width={100} src={Facebook_Logo} alt="Facebook logo" /> */}
            Facebook
          </Link>
        </button>
      </div>
      <br />
      <p>
        <small>Login with credentials</small>
      </p>
      <form onSubmit={validateUserInput}>
        <input
          type="text"
          ref={LoginInputEmail}
          placeholder="Enter email here..."
        />
        <br />
        <input
          type="password"
          ref={LoginInputPassword}
          placeholder="Enter password here..."
        />
        <br />
        <input type="submit" value="Send" />
      </form>
      {error && <small style={{ color: "red" }}>{error}</small>}
      <p>
        <small>
          Haven't created an account yet? <Link to="/register">Sign Up</Link>
        </small>
      </p>
    </div>
  );
}
