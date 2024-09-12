import React from "react";
import { NavBar } from "../components/NavBar";

export class HomePage extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello From Home Page</h1>
        <NavBar />
      </div>
    );
  }
}
