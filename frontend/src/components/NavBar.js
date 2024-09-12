import React from "react";
import { Link } from "react-router-dom";
import DefaultProfileImage from "../../public/assets/images/profile_image_default.jpg";
import SightLogo from "../../public/assets/images/Muzik_Full_Logo.png";

export class NavBar extends React.Component {
  render() {
    // Get the userId from localStorage
    const userId = localStorage.getItem("userId");

    // If there's no userId in localStorage, redirect to login or handle appropriately
    if (!userId) {
      return (
        <nav>
          <Link to="/login" className="btn btn-danger">
            Login
          </Link>
        </nav>
      );
    }

    return (
      <nav>
        <Link to="/home">
          <img width="100px" src={SightLogo} alt="home_logo" />
        </Link>
        <Link to="/songfeed">Songs Feed</Link>
        <Link to="/playlistfeed">Playlists Feed</Link>
        <Link to={`/my_playlists/${localStorage.getItem("userId")}`}>
          My Playlist
        </Link>

        <Link to={`/profile/${userId}`}>
          <img width="50px" src={DefaultProfileImage} alt="default_image" />
        </Link>

        <Link
          to="/login"
          className="btn btn-danger"
          onClick={() => localStorage.removeItem("userId")}
        >
          Logout
        </Link>
      </nav>
    );
  }
}
