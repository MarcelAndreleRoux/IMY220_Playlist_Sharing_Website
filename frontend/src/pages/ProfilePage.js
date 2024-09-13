import React from "react";
import { Link, useParams } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import DefaultProfileImage from "../../public/assets/images/profile_image_default.jpg";

export const ProfilePage = ({ users, playlists }) => {
  const { userid } = useParams(); // Get userId from the URL
  const loggedInUserId = parseInt(localStorage.getItem("userId")); // Get logged-in userId from localStorage
  const viewingUserId = parseInt(userid); // The profile we're viewing
  const currentUser = users.find((user) => user.userId === viewingUserId); // The user we are viewing

  if (!currentUser) {
    return <p>User not found. Please log in.</p>;
  }

  const userPlaylists = playlists.filter(
    (playlist) => playlist.creatorId === viewingUserId
  );

  const userFriends = currentUser.friends || [];

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4">
            <div className="card p-3">
              <img
                src={currentUser.profilePic || DefaultProfileImage}
                alt="Profile"
                className="img-fluid rounded-circle mb-3"
              />
              <h2>{currentUser.username}</h2>
              <p>Email: {currentUser.email}</p>
              {/* Only show Edit Profile button if the logged-in user is viewing their own profile */}
              {loggedInUserId === viewingUserId && (
                <Link
                  to={`/edit_profile/${loggedInUserId}`}
                  className="btn btn-primary mt-3"
                >
                  Edit Profile
                </Link>
              )}
            </div>
          </div>

          <div className="col-md-8">
            <h3>
              {loggedInUserId === viewingUserId ? "My Playlists" : "Playlists"}
            </h3>
            {userPlaylists.length > 0 ? (
              <ul className="list-group mb-4">
                {userPlaylists.map((playlist) => (
                  <li key={playlist.id} className="list-group-item">
                    <Link to={`/playlist/${playlist.id}`}>
                      <strong>{playlist.name}</strong>
                    </Link>
                    <p>{playlist.description}</p>
                    <span className="badge bg-secondary">
                      {playlist.hashtags.join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                {loggedInUserId === viewingUserId
                  ? "You haven't created any playlists yet."
                  : "This user hasn't created any playlists yet."}
              </p>
            )}

            <h3>Friends</h3>
            <ul className="list-group">
              {userFriends.map((friendId) => {
                const friend = users.find((user) => user.userId === friendId);
                return friend ? (
                  <li key={friend.userId} className="list-group-item">
                    <img
                      src={friend.profilePic}
                      alt="Friend"
                      className="rounded-circle"
                      width="40"
                    />
                    <Link to={`/profile/${friend.userId}`}>
                      {friend.username}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>

            <h3>Recent Activity</h3>
            {currentUser.comments && currentUser.comments.length > 0 ? (
              <ul className="list-group">
                {currentUser.comments.map((comment) => (
                  <li key={comment.id} className="list-group-item">
                    <p>{comment.text}</p>
                    <Link to={`/playlist/${comment.playlistId}`}>
                      View Playlist
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
