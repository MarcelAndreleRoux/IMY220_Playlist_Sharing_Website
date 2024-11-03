import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";
import { PlaylistContext } from "../context/PlaylistContext";

const PlaylistCard = ({ playlist }) => {
  const { authenticatedUser, users, handleLikePlaylist, handleUnlikePlaylist } =
    useContext(PlaylistContext);
  const [creatorName, setCreatorName] = useState("Unknown");

  useEffect(() => {
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
    <div className="bg-dark text-light p-4 rounded-lg shadow-md transform hover:scale-105 transition duration-300">
      <Link to={`/playlist/${playlist._id}`} className="no-underline">
        <img
          src={playlist.coverImage || DefaultImage}
          alt={playlist.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </Link>
      <div className="p-4">
        <h5 className="text-xl font-semibold text-yellow-400">
          <Link to={`/playlist/${playlist._id}`} className="hover:underline">
            {playlist.name}
          </Link>
        </h5>
        <p className="text-sm text-light mb-1">
          By:{" "}
          <Link
            to={`/profile/${creatorName}`}
            className="text-orange-500 hover:underline"
          >
            {creatorName}
          </Link>
        </p>
        <p className="text-sm text-light">
          Total Followers: {playlist.followers?.length || 0}
        </p>
        <p className="text-sm text-light">
          <strong>Created on: </strong>
          {formattedDate}
        </p>
      </div>
      <div className="px-4 py-2">
        {isCreatedPlaylist ? (
          <Link to={`/edit_playlist/${playlist._id}`}>
            <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600">
              Edit
            </button>
          </Link>
        ) : isPlaylistLiked ? (
          <button
            className="w-full py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
            onClick={() => handleUnlikePlaylist(playlist._id)}
          >
            Unlike
          </button>
        ) : (
          <button
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            onClick={() => handleLikePlaylist(playlist._id)}
          >
            Like
          </button>
        )}
      </div>
    </div>
  );
};

export default PlaylistCard;
