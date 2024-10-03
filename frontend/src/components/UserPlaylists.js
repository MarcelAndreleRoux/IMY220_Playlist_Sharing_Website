import React from "react";
import { Link } from "react-router-dom";
import NoPlaylistsMessage from "./NoPlaylistsMessage";

const UserPlaylists = ({ userPlaylists, loggedInUserId, viewingUserId }) => {
  return (
    <>
      <h3>{loggedInUserId === viewingUserId ? "My Playlists" : "Playlists"}</h3>
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
          <NoPlaylistsMessage
            message={
              loggedInUserId === viewingUserId
                ? "You haven't created any playlists yet."
                : "This user hasn't created any playlists yet."
            }
            linkText="Find Playlists"
            linkTo="/playlistfeed"
          />
        </p>
      )}
    </>
  );
};

export default UserPlaylists;
