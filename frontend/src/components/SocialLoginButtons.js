import React, { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import { useNavigate } from "react-router-dom";

const SocialLoginButtons = () => {
  const { setAuthenticatedUser } = useContext(PlaylistContext); // Use Context
  const navigate = useNavigate();

  const handleSocialLogin = async (platform) => {
    const defaultUser = {
      username: `${platform}_user`,
      email: `${platform}@example.com`,
    };

    setAuthenticatedUser(defaultUser.username, defaultUser.email);
    localStorage.setItem("userId", defaultUser.userId);

    navigate("/home");
  };

  return (
    <div className="d-flex justify-content-between mb-3">
      <button
        onClick={() => handleSocialLogin("Google")}
        className="btn btn-outline-primary"
      >
        Google
      </button>
      <button
        onClick={() => handleSocialLogin("Twitter")}
        className="btn btn-outline-info"
      >
        Twitter/X
      </button>
      <button
        onClick={() => handleSocialLogin("Facebook")}
        className="btn btn-outline-primary"
      >
        Facebook
      </button>
    </div>
  );
};

export default SocialLoginButtons;
