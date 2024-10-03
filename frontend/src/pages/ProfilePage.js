import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { PlaylistContext } from "../context/PlaylistContext";
import ProfileInfo from "../components/ProfileInfo";
import UserPlaylists from "../components/UserPlaylists";
import FriendsList from "../components/FriendsList";
import RecentActivity from "../components/RecentActivity";

const ProfilePage = () => {
  const { userid } = useParams();
  const { users, playlists } = useContext(PlaylistContext); // Access data from the context
  const loggedInUserId = parseInt(localStorage.getItem("userId")); // Get logged-in userId from localStorage
  const viewingUserId = parseInt(userid); // The profile we're viewing
  const currentUser = users.find((user) => user.userId === viewingUserId);

  if (!currentUser) {
    return (
      <div>
        <NavBar />
        <p>User not found. Please log in.</p>
      </div>
    );
  }

  const userPlaylists = playlists.filter(
    (playlist) => playlist.creatorId === viewingUserId
  );

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4">
            <ProfileInfo
              currentUser={currentUser}
              loggedInUserId={loggedInUserId}
              viewingUserId={viewingUserId}
            />
          </div>

          <div className="col-md-8">
            <UserPlaylists
              userPlaylists={userPlaylists}
              loggedInUserId={loggedInUserId}
              viewingUserId={viewingUserId}
            />
            <FriendsList users={users} currentUser={currentUser} />
            <RecentActivity currentUser={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
