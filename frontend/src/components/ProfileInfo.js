import React from "react";
import { Link } from "react-router-dom";
import DefaultProfileImage from "../../public/assets/images/profile_image_default.jpg";

const ProfileInfo = ({ currentUser, loggedInUserId, viewingUserId }) => {
  return (
    <div className="card p-3">
      <img
        src={currentUser.profilePic || DefaultProfileImage}
        alt="Profile"
        className="img-fluid rounded-circle mb-3"
      />
      <h2>{currentUser.username}</h2>
      <p>Email: {currentUser.email}</p>
      {loggedInUserId === viewingUserId && (
        <Link
          to={`/edit_profile/${loggedInUserId}`}
          className="btn btn-primary mt-3"
        >
          Edit Profile
        </Link>
      )}
    </div>
  );
};

export default ProfileInfo;
