import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";
import { PlaylistContext } from "../context/PlaylistContext";

const PlaylistCard = ({
  playlist,
  currentUser,
  handleFastAdd,
  handleRemovePlaylist,
  isCreatedPlaylist = false,
}) => {
  const { users } = useContext(PlaylistContext); // Access users from context
  const [creatorName, setCreatorName] = useState("Unknown");
  const [buttonText, setButtonText] = useState("Like Playlist");

  // Find the creator by the creatorId and set the name
  useEffect(() => {
    const creator = users.find((user) => user.userId === playlist.creatorId);
    if (creator) {
      setCreatorName(creator.username);
    }

    // Set button text based on whether the playlist is already added
    if (currentUser?.playlists.includes(playlist.id)) {
      setButtonText("Remove from Playlist");
    }
  }, [playlist.creatorId, users, currentUser]);

  const handleAddOrRemove = () => {
    if (buttonText === "Like Playlist") {
      handleFastAdd(playlist);
      setButtonText("Adding...");
      setTimeout(() => setButtonText("Remove from Playlist"), 300);
    } else {
      handleRemovePlaylist(playlist.id);
      setButtonText("Like Playlist");
    }
  };

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
        </Link>
        <div className="card-body">
          <h5 className="card-title">
            <Link to={`/playlist/${playlist.id}`}>{playlist.name}</Link>
          </h5>
          <p className="card-text">
            By: <Link to={`/profile/${playlist.creatorId}`}>{creatorName}</Link>
          </p>
          <p>Total Followers: {playlist.followers.length}</p>
          <p>
            <strong>Created on: </strong>
            {formattedDate}
          </p>
        </div>

        <div className="card-footer">
          {isCreatedPlaylist ? (
            <Link to={`/edit_playlist/${playlist.id}`}>
              <button className="btn btn-warning">Edit Playlist</button>
            </Link>
          ) : (
            <button className="btn btn-primary" onClick={handleAddOrRemove}>
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
