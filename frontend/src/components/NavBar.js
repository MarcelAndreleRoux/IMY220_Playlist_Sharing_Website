import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import DefaultProfileImage from "../../public/assets/images/profile_image_default.jpg";
import SightLogo from "../../public/assets/images/Muzik_Full_Logo.png";
import { PlaylistContext } from "../context/PlaylistContext";

const NavBar = () => {
  const { authenticatedUser } = useContext(PlaylistContext);
  const navigate = useNavigate();

  const handleMyPlaylistsClick = (e) => {
    if (!authenticatedUser) {
      e.preventDefault();
      alert("You must be logged in to view your playlists.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const userId = authenticatedUser?.userId;
  const profilePic = authenticatedUser?.profilePic || DefaultProfileImage;

  return (
    <nav>
      <Link to="/home">
        <img width="100px" src={SightLogo} alt="home_logo" />
      </Link>
      <Link to="/songfeed">Songs Feed</Link>
      <Link to="/playlistfeed">Playlists Feed</Link>

      <Link to={`/my_playlists/${userId}`} onClick={handleMyPlaylistsClick}>
        My Playlist
      </Link>

      {authenticatedUser ? (
        <Link to={`/profile/${userId}`}>
          <img
            width="50px"
            src={profilePic}
            alt="profile_image"
            className="rounded-circle"
          />
        </Link>
      ) : (
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      )}

      {authenticatedUser && (
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default NavBar;
