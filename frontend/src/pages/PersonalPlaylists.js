import React from "react";
import { useParams, Link } from "react-router-dom";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";
import { NavBar } from "../components/NavBar";

function PersonalPlaylists({ playlists, users }) {
  // Call useParams() to get the userId
  const { userId } = useParams();

  // Find the current user based on userId
  const user = users.find((user) => user.userId === parseInt(userId));

  // Filter the playlists to only include those created by the current user
  const userPlaylists = playlists.filter(
    (playlist) => playlist.creatorId === parseInt(userId)
  );

  if (!user || userPlaylists.length === 0) {
    return (
      <>
        <NavBar />
        <p>No playlists added yet.</p>
        <Link to="/playlistfeed">Add Something</Link>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <h2>{user.username}'s Playlists</h2>
        <div className="row">
          {userPlaylists.map((playlist) => (
            <div key={playlist.id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={playlist.coverImage || DefaultImage}
                  className="card-img-top"
                  alt={playlist.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{playlist.name}</h5>
                  <p className="card-text">
                    By {playlist.artist || "Unknown Artist"}
                  </p>
                </div>
                <Link
                  to={`/playlist/${playlist.id}`}
                  className="btn btn-primary"
                >
                  Go to Playlist
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default PersonalPlaylists;
