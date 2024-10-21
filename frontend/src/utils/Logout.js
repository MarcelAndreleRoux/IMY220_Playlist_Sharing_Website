import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";

const Logout = () => {
  const { logoutUser } = useContext(PlaylistContext);
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser(); // Clear the user data
    navigate("/login", { replace: true }); // Redirect to login
  }, [logoutUser, navigate]);

  return null; // No UI needed
};

export default Logout;
