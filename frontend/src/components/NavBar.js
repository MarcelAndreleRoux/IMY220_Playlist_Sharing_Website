import React from "react";
import { Link } from "react-router-dom";
import DefaultProfileImage from "../../public/assets/images/profile_image_default.jpg";
import SightLogo from "../../public/assets/images/Muzik_Full_Logo.png";

export class NavBar extends React.Component {
  handleMyPlaylistsClick = (e) => {
    const userId = localStorage.getItem("userId");

    if (userId == "undefined") {
      // Prevent navigation
      e.preventDefault();

      // Display alert to user
      alert("You must be logged in to view your playlists.");
    }
  };

  render() {
    // Get the userId and user data from localStorage
    const userId = localStorage.getItem("userId");
    const userData = JSON.parse(localStorage.getItem("authenticatedUser"));

    // Get the user's profile picture (use default if none)
    const profilePic =
      userData && userData.profilePic
        ? userData.profilePic
        : DefaultProfileImage;

    return (
      <nav>
        <Link to="/home">
          <img width="100px" src={SightLogo} alt="home_logo" />
        </Link>
        <Link to="/songfeed">Songs Feed</Link>
        <Link to="/playlistfeed">Playlists Feed</Link>

        <Link
          to={`/my_playlists/${userId}`}
          onClick={this.handleMyPlaylistsClick}
        >
          My Playlist
        </Link>

        <Link to={`/profile/${userId}`}>
          <img
            width="50px"
            src={profilePic}
            alt="profile_image"
            className="rounded-circle"
          />
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
