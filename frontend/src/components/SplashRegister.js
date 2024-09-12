import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export class SplashLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      error: "",
      formValid: false, // Track if the form is valid
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.validateUserInput = this.validateUserInput.bind(this);
  }

  // Handle input changes for controlled components
  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  // Validate form inputs
  validateUserInput(e) {
    e.preventDefault(); // Prevent form submission

    const { username, email, password, confirmPassword } = this.state;
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
    const { formValid } = this.state;

    return (
      <div className="container mt-5">
        <h1>Register</h1>
        <p className="text-muted">
          <small>Sign up with social media</small>
        </p>
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-outline-primary">
            <NavLink to="/login">Google</NavLink>
          </button>
          <button className="btn btn-outline-info">
            <NavLink to="/login">Twitter/X</NavLink>
          </button>
          <button className="btn btn-outline-primary">
            <NavLink to="/login">Facebook</NavLink>
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
              name="username"
              placeholder="Enter username here..."
              value={this.state.username}
              onChange={this.handleInputChange}
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
              name="email"
              placeholder="Enter email here..."
              value={this.state.email}
              onChange={this.handleInputChange}
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
              name="password"
              placeholder="Enter password here..."
              value={this.state.password}
              onChange={this.handleInputChange}
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
              name="confirmPassword"
              placeholder="Confirm your password..."
              value={this.state.confirmPassword}
              onChange={this.handleInputChange}
            />
          </div>

          <div>
            <button type="submit" className="btn btn-success">
              Validate
            </button>
            {formValid && (
              <NavLink to="/login" className="btn btn-primary ms-2">
                Sign Up
              </NavLink>
            )}
          </div>
        </form>

        {this.state.error && (
          <div className="mt-3 alert alert-danger" role="alert">
            {this.state.error}
          </div>
        )}

        <p className="mt-3">
          <small>
            Already have an account? <NavLink to="/login">Log In</NavLink>
          </small>
        </p>
      </div>
    );
  }
}
