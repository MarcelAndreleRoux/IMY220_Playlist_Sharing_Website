import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SightLogo from "../../public/assets/images/Muzik_Full_Logo.png";
import { PlaylistContext } from "../context/PlaylistContext";
import { deleteCookie } from "../utils/utils";

const NavBar = () => {
  const { authenticatedUser, setAuthenticatedUser } =
    useContext(PlaylistContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Authenticated User: ", authenticatedUser);
  }, [authenticatedUser]);

  const handleLogout = () => {
    setAuthenticatedUser(null);
    sessionStorage.removeItem("authenticatedUser");
    deleteCookie("userId");
    navigate("/login");
  };

  const username = authenticatedUser?.username;
  const profilePic = authenticatedUser?.profilePic;

  return (
    <nav className="flex items-center justify-between bg-yellow-400 px-4 py-2 shadow-md">
      <Link to="/home" className="flex items-center">
        <img src={SightLogo} alt="home_logo" className="w-20" />
      </Link>

      <div className="flex space-x-8 font-semibold">
        <Link to="/home" className="hover:underline">
          Home
        </Link>
        <Link to="/playlistfeed" className="hover:underline">
          Explore
        </Link>
        <Link to={`/my_playlists/${username}`} className="hover:underline">
          My Collection
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {authenticatedUser ? (
          <Link to={`/profile/${username}`}>
            <img
              src={profilePic}
              alt="profile_image"
              className="w-12 h-12 rounded-full"
            />
          </Link>
        ) : (
          <Link
            to="/login"
            className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Login
          </Link>
        )}
        {authenticatedUser && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
