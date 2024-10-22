import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SightLogo from "../../public/assets/images/Muzik_Full_Logo.png";
import { PlaylistContext } from "../context/PlaylistContext";

const NavBar = () => {
  const { authenticatedUser, setAuthenticatedUser } =
    useContext(PlaylistContext);
  const navigate = useNavigate();

  // Debugging: Log the authenticatedUser
  useEffect(() => {
    console.log("Authenticated User: ", authenticatedUser);
  }, [authenticatedUser]);

  const handleMyPlaylistsClick = (e) => {
    if (!authenticatedUser) {
      e.preventDefault();
      alert("You must be logged in to view your playlists.");
    }
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    localStorage.removeItem("authenticatedUser");
    navigate("/login");
  };

  const username = authenticatedUser?.username;
  const profilePic = authenticatedUser?.profilePic;

  return (
    <nav>
      <Link to="/home">
        <img width="100px" src={SightLogo} alt="home_logo" />
      </Link>
      <Link to="/songfeed">Songs Feed</Link>
      <Link to="/playlistfeed">Playlists Feed</Link>

      <Link to={`/my_playlists/${username}`} onClick={handleMyPlaylistsClick}>
        My Playlist
      </Link>

      {authenticatedUser ? (
        <Link to={`/profile/${username}`}>
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
