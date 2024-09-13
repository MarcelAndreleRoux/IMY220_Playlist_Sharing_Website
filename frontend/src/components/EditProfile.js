import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams to get userid from the URL
import DefaultProfileImage from "../../public/assets/images/profile_image_default.jpg";
import { NavBar } from "../components/NavBar";

const EditProfile = ({ users, setUsers }) => {
  const { userid } = useParams(); // Get userid from the URL params
  const navigate = useNavigate();
  const userIdFromStorage = localStorage.getItem("userId");
  const userId = userid ? userid : userIdFromStorage; // Use the route userId if available or fallback to localStorage
  const currentUser = users.find((user) => user.userId === parseInt(userId));

  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(
    currentUser?.profilePic || DefaultProfileImage
  );
  const [error, setError] = useState("");

  const profilePicRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      alert("Please log in to edit your profile.");
      navigate("/login");
    }
  }, [userId, navigate]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const updatedUsers = users.map((user) => {
      if (user.userId === parseInt(userId)) {
        const updatedUser = {
          ...user,
          username: username,
          email: email,
          profilePic: profilePic,
          password: password ? password : user.password,
        };

        // Update the authenticated user in localStorage as well
        localStorage.setItem("authenticatedUser", JSON.stringify(updatedUser));

        return updatedUser;
      }
      return user;
    });

    setUsers(updatedUsers);
    navigate(`/profile/${userId}`);
  };

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <h1>Edit Profile</h1>
        <form onSubmit={handleSaveChanges}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              New Password (optional)
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="profilePic" className="form-label">
              Profile Picture
            </label>
            <input
              type="file"
              className="form-control"
              id="profilePic"
              ref={profilePicRef}
              onChange={handleProfilePicChange}
            />
            <img
              src={profilePic}
              alt="Profile Preview"
              width="150px"
              className="mt-3 rounded-circle"
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
