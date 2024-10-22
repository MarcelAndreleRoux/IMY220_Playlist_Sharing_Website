import React from "react";
import { Link } from "react-router-dom";

const AddPlaylistButton = () => (
  <Link to="/create_playlist" className="add-playlist-btn">
    + Add Playlist
    <style jsx="true">{`
      .add-playlist-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 50px;
        text-align: center;
        font-size: 18px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
      }
      .add-playlist-btn:hover {
        background-color: #218838;
        text-decoration: none;
      }
    `}</style>
  </Link>
);

export default AddPlaylistButton;
