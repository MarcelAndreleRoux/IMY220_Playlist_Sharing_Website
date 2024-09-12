import React from "react";
import { Link } from "react-router-dom";

export class SplashPage extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello From Splash Page</h1>
        <Link to="/login">Explore</Link>
      </div>
    );
  }
}
