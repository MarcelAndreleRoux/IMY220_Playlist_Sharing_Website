import React from "react";
import { Link } from "react-router-dom";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";

const PlaylistCard = ({
  playlist,
  currentUser,
  handleFastAdd,
  isPersonalView = false,
}) => {
  const alreadyInPlaylists = currentUser
    ? currentUser.playlists.includes(playlist.id)
    : false;

  const formattedDate = new Date(playlist.creationDate).toLocaleDateString();

  return (
    <div className="col-md-4 mb-4">
      <div className="card" style={{ height: "100%" }}>
        <Link to={`/playlist/${playlist.id}`}>
          <img
            src={playlist.coverImage || DefaultImage}
            className="card-img-top"
            alt={playlist.name}
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title">{playlist.name}</h5>
            <p className="card-text">By {playlist.artist || "Unknown"}</p>
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
        </Link>

        {!isPersonalView && (
          <div className="card-footer">
            <button
              className="btn btn-primary"
              onClick={() => handleFastAdd(playlist)}
              disabled={alreadyInPlaylists}
            >
              {alreadyInPlaylists ? "Added" : "Like Playlist"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistCard;
