import React from "react";
import { Link } from "react-router-dom";

export class SplashRegister extends React.Component {
  constructor(props) {
    super(props);
    this.usernameRef = React.createRef();
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
    this.confirmPasswordRef = React.createRef();
    this.state = {
      error: "",
      formValid: false,
    };

    this.validateUserInput = this.validateUserInput.bind(this);
  }

  // Validate form inputs
  validateUserInput(e) {
    e.preventDefault();

    const username = this.usernameRef.current.value;
    const email = this.emailRef.current.value;
    const password = this.passwordRef.current.value;
    const confirmPassword = this.confirmPasswordRef.current.value;
    const { users } = this.props;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      this.setState({ error: "Please fill in all fields.", formValid: false });
      return;
    }

    if (!email.includes("@")) {
      this.setState({
        error: "Please enter a valid email address.",
        formValid: false,
      });
      return;
    }

    if (password.length < 8) {
      this.setState({
        error: "Password must be at least 8 characters long.",
        formValid: false,
      });
      return;
    }

    if (password !== confirmPassword) {
      this.setState({ error: "Passwords do not match.", formValid: false });
      return;
    }

    // Check if the email already exists in the users array
    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
      this.setState({
        error: "Email already exists. Please use another email.",
        formValid: false,
      });
      return;
    }

    // If everything passes validation
    this.setState({ error: "", formValid: true });
  }

  render() {
    const { formValid, error } = this.state;

    return (
      <div className="container mt-5">
        <h1>Register</h1>
        <p className="text-muted">
          <small>Sign up with social media</small>
        </p>
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-outline-primary">
            <Link to="/login">Google</Link>
          </button>
          <button className="btn btn-outline-info">
            <Link to="/login">Twitter/X</Link>
          </button>
          <button className="btn btn-outline-primary">
            <Link to="/login">Facebook</Link>
          </button>
        </div>

        <p className="text-muted">
          <small>Sign up with your details</small>
        </p>

        <form onSubmit={this.validateUserInput}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              ref={this.usernameRef}
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
              ref={this.emailRef}
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
              ref={this.passwordRef}
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
              ref={this.confirmPasswordRef}
              placeholder="Confirm your password..."
            />
          </div>

          <div>
            <button type="submit" className="btn btn-success">
              Validate
            </button>
            {formValid && (
              <Link to="/login" className="btn btn-primary ms-2">
                Sign Up
              </Link>
            )}
          </div>
        </form>

        {error && (
          <div className="mt-3 alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <p className="mt-3">
          <small>
            Already have an account? <Link to="/login">Log In</Link>
          </small>
        </p>
      </div>
    );
  }
}
