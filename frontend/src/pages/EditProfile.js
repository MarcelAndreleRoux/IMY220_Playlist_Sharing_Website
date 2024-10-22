import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";
import NavBar from "../components/NavBar";
import ProfileForm from "../components/ProfileForm";

const EditProfile = () => {
  const { users, setUsers } = useContext(PlaylistContext);
  const { username } = useParams();
  const navigate = useNavigate();

  const currentUser = users.find((user) => user.username === username);

  const [profileData, setProfileData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    confirmPassword: "",
    profilePic: currentUser?.profilePic,
  });

  const [error, setError] = useState("");

  const handleSaveChanges = (updatedProfileData) => {
    if (updatedProfileData.password !== updatedProfileData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const updatedUsers = users.map((user) => {
      if (user.username === username) {
        const updatedUser = {
          ...user,
          username: updatedProfileData.username,
          email: updatedProfileData.email,
          profilePic: updatedProfileData.profilePic,
          password: updatedProfileData.password
            ? updatedProfileData.password
            : user.password,
        };

        // Update the authenticated user in localStorage as well
        localStorage.setItem(
          "authenticatedUser",
          JSON.stringify(updatedUser.username)
        );

        return updatedUser;
      }
      return user;
    });

    setUsers(updatedUsers);
    navigate(`/profile/${updatedProfileData.username}`);
  };

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <h1>Edit Profile</h1>
        <ProfileForm
          profileData={profileData}
          setProfileData={setProfileData}
          handleSaveChanges={handleSaveChanges}
          error={error}
        />
      </div>
    </>
  );
};

export default EditProfile;
