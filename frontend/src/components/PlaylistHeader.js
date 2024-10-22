import React from "react";
import { Link } from "react-router-dom";

const PlaylistHeader = ({ playlist, userId, users }) => {
  const creator = users.find((user) => user.userId === playlist.creatorId);

  return (
    <div className="playlist-header">
      <img
        src={playlist.coverImage}
        alt={playlist.name}
        className="img-fluid mb-3"
      />
      <h2>{playlist.name}</h2>
      <p>
        Created by:{" "}
        {creator ? (
          <Link to={`/profile/${creator.username}`}>{creator.username}</Link>
        ) : (
          "Unknown Creator"
        )}
      </p>
      {creator && creator.userId === userId && (
        <Link to={`/edit_playlist/${playlist.id}`} className="btn btn-primary">
          Edit Playlist
        </Link>
      )}
    </div>
  );
};

export default PlaylistHeader;
