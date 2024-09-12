// Edit profile information (name, bio, profile picture, pronouns, social media links, etc.)
// View and manage friend connections (send/accept friend requests, unfriend users)
// View their friends' list and friend activity
// See who is currently online (optional bonus feature)

import React from "react";
import { useParams } from "react-router-dom";

const EditProfilePage = ({ users }) => {
  const { userid } = useParams();

  const user = users.find((u) => u.id === parseInt(userid));

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>Edit Profile for {user.username}</h1>
      <form>
        <label>
          Username:
          <input type="text" defaultValue={user.username} />
        </label>
        <label>
          Email:
          <input type="email" defaultValue={user.email} />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfilePage;
