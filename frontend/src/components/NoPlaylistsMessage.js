import React from "react";
import { Link } from "react-router-dom";

const NoPlaylistsMessage = ({
  message,
  showCreateLink = false,
  showExploreLink = false,
}) => {
  return (
    <div className="col-12">
      <div className="alert alert-info">
        <p>{message}</p>
        {showCreateLink && (
          <Link to="/create_playlist" className="btn btn-primary mt-2">
            Create Your First Playlist
          </Link>
        )}
        {showExploreLink && (
          <Link to="/home?tab=playlists" className="btn btn-primary mt-2">
            Explore Playlists
          </Link>
        )}
      </div>
    </div>
  );
};

export default NoPlaylistsMessage;
