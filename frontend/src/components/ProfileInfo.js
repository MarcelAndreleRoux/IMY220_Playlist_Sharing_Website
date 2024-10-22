import React from "react";
import { Link } from "react-router-dom";

const ProfileInfo = ({ currentUser, authenticatedUser }) => {
  const isCurrentUser = authenticatedUser?.username === currentUser.username;

  return (
    <div className="card p-3">
      <img
        src={currentUser.profilePic}
        alt="Profile"
        className="img-fluid rounded-circle mb-3"
      />
      <h2>{currentUser.username}</h2>
      <p>Email: {currentUser.email}</p>
      {isCurrentUser && (
        <Link
          to={`/edit_profile/${currentUser.username}`}
          className="btn btn-primary mt-3"
        >
          Edit Profile
        </Link>
      )}
    </div>
  );
};

export default ProfileInfo;
