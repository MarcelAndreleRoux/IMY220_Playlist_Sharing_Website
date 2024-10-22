import React, { useState } from "react";
import { Link } from "react-router-dom";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";

const PlaylistCard = ({
  playlist,
  currentUser,
  handleFastAdd,
  handleRemovePlaylist,
  isPersonalView = false,
}) => {
  const [buttonText, setButtonText] = useState(
    isPersonalView ? "Remove from Playlist" : "Like Playlist"
  );
  const [showPopup, setShowPopup] = useState(false); // Popup state

  const confirmRemove = () => {
    setShowPopup(true); // Show confirmation popup
  };

  const handleConfirm = () => {
    handleRemovePlaylist(playlist.id);
    setButtonText("Like Playlist");
    setShowPopup(false); // Close popup
  };

  const handleCancel = () => {
    setShowPopup(false); // Close popup without removing
  };

  const handleAddOrRemove = () => {
    if (buttonText === "Like Playlist") {
      handleFastAdd(playlist);
      setButtonText("Adding...");
      setTimeout(() => setButtonText("Remove from Playlist"), 300);
    } else {
      confirmRemove();
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

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>Are you sure you want to remove this playlist?</p>
              <button className="btn btn-danger" onClick={handleConfirm}>
                Yes, Remove
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <style jsx="true">{`
          .popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .popup-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
          }
        `}</style>

        <div className="card-footer">
          <button className="btn btn-primary" onClick={handleAddOrRemove}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
