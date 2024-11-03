import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";
import { PlaylistContext } from "../context/PlaylistContext";

const PlaylistCard = ({ playlist }) => {
  const { authenticatedUser, users, handleLikePlaylist, handleUnlikePlaylist } =
    useContext(PlaylistContext);
  const [creatorName, setCreatorName] = useState("Unknown");

  useEffect(() => {
    // Find the user who created the playlist based on `creatorId`
    const creator = users.find((user) => user._id === playlist.creatorId);
    if (creator) {
      setCreatorName(creator.username);
    } else {
      setCreatorName("Unknown");
    }
  }, [playlist.creatorId, users]);

  const isPlaylistLiked = authenticatedUser?.playlists?.includes(playlist._id);
  const isCreatedPlaylist = authenticatedUser?.created_playlists?.includes(
    playlist._id
  );

  const formattedDate = new Date(playlist.creationDate).toLocaleDateString();

  return (
    <div className="col-md-4 mb-4">
      <div className="card" style={{ height: "100%" }}>
        <Link to={`/playlist/${playlist._id}`}>
          <img
            src={playlist.coverImage || DefaultImage}
            className="card-img-top"
            alt={playlist.name}
            style={{ height: "200px", objectFit: "cover" }}
          />
        </Link>
        <div className="card-body">
          <h5 className="card-title">
            <Link to={`/playlist/${playlist._id}`}>{playlist.name}</Link>
          </h5>
          <p className="card-text">
            By: <Link to={`/profile/${playlist.creatorId}`}>{creatorName}</Link>
          </p>
          <p>Total Followers: {playlist.followers?.length || 0}</p>
          <p>
            <strong>Created on: </strong>
            {formattedDate}
          </p>
        </div>

        <div className="card-footer">
          {isCreatedPlaylist ? (
            <Link to={`/edit_playlist/${playlist._id}`}>
              <button className="btn btn-warning">Edit</button>
            </Link>
          ) : isPlaylistLiked ? (
            <button
              className="btn btn-danger"
              onClick={() => handleUnlikePlaylist(playlist._id)}
            >
              Unlike
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => handleLikePlaylist(playlist._id)}
            >
              Like
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
