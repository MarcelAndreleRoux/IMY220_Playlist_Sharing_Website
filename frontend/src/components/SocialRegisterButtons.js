import React, { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import { useNavigate } from "react-router-dom";

const SocialRegisterButtons = () => {
  const { setAuthenticatedUser, setUsers, users } = useContext(PlaylistContext);
  const navigate = useNavigate();

  const handleSocialRegister = (platform) => {
    const newUser = {
      userId: users.length + 1,
      username: `${platform}_user`,
      email: `${platform}@example.com`,
      password: `${platform}_default_password`,
      friends: [],
      playlists: [],
      profilePic:
        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
    };

    setUsers([...users, newUser]);
    setAuthenticatedUser(newUser.username, newUser.email, newUser.userId);
    localStorage.setItem("userId", newUser.userId);

    navigate("/home");
  };

  return (
    <div className="d-flex justify-content-between mb-3">
      <button
        onClick={() => handleSocialRegister("Google")}
        className="btn btn-outline-primary"
      >
        Google
      </button>
      <button
        onClick={() => handleSocialRegister("Twitter")}
        className="btn btn-outline-info"
      >
        Twitter/X
      </button>
      <button
        onClick={() => handleSocialRegister("Facebook")}
        className="btn btn-outline-primary"
      >
        Facebook
      </button>
    </div>
  );
};

export default SocialRegisterButtons;
