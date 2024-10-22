import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { PlaylistContext } from "../context/PlaylistContext";
import ProfileInfo from "../components/ProfileInfo";
import UserPlaylists from "../components/UserPlaylists";
import FriendsList from "../components/FriendsList";
import RecentActivity from "../components/RecentActivity";

const ProfilePage = () => {
  const { username } = useParams();
  const { users, playlists, authenticatedUser } = useContext(PlaylistContext);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = users.find((user) => user.username === username);
    setCurrentUser(user);
  }, [username, users]);

  if (!currentUser) {
    return (
      <div>
        <NavBar />
        <p>User not found or still loading...</p>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    );
  }

  const userPlaylists = playlists.filter(
    (playlist) => playlist.creatorId === currentUser.userId
  );

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4">
            <ProfileInfo
              currentUser={currentUser}
              authenticatedUser={authenticatedUser}
            />
          </div>

          <div className="col-md-8">
            <UserPlaylists userPlaylists={userPlaylists} />
            <FriendsList users={users} currentUser={currentUser} />
            <RecentActivity currentUser={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
