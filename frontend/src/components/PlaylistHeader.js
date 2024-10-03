import React from "react";
import { Link } from "react-router-dom";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";

const PlaylistHeader = ({ playlist, userId }) => {
  const formattedDate = new Date(playlist.creationDate).toLocaleDateString();

  return (
    <div className="row">
      <div className="col-4">
        <img
          src={playlist.coverImage || DefaultImage}
          alt="Playlist Cover"
          className="img-fluid mb-4"
        />
      </div>
      <div className="col">
        <h1>{playlist.name}</h1>
        <p>{playlist.description}</p>
        {playlist.hashtags && playlist.hashtags.length > 0 && (
          <div>
            <strong>Hashtags: </strong>
            {playlist.hashtags.map((hashtag, index) => (
              <span key={index} className="badge bg-secondary me-1">
                {hashtag}
              </span>
            ))}
          </div>
        )}
        <p>
          <strong>Created on: </strong>
          {formattedDate}
        </p>
      </div>
      <div className="col">
        {playlist.creatorId === userId && (
          <Link
            to={`/edit_playlist/${playlist.id}`}
            className="btn btn-primary"
          >
            Edit Playlist
          </Link>
        )}
      </div>
    </div>
  );
};

export default PlaylistHeader;
