import React from "react";
import { Link } from "react-router-dom";

const NoPlaylistsMessage = ({
  message = "No playlists added yet.",
  linkText = "Add Something",
  linkTo = "/playlistfeed",
}) => {
  return (
    <div className="container mt-5 text-center">
      <p>{message}</p>
      <Link to={linkTo} className="btn btn-primary">
        {linkText}
      </Link>
    </div>
  );
};

export default NoPlaylistsMessage;
