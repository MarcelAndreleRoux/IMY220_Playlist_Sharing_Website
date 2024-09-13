// Manage their own playlists by editing details (name, genre, image, etc.), reordering songs, or adding/removing songs.
// Completely delete their own playlists from the database.
// Should be able to add hastags to playlist

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const EditPlaylist = ({ playlists, songs, genres, users, setPlaylists }) => {
  const { playlistid } = useParams();
  const navigate = useNavigate();

  const playlist = playlists.find((pl) => pl.id === parseInt(playlistid));
  const userId = localStorage.getItem("userId");

  // If the playlist doesn't exist or the user isn't the owner, redirect back
  useEffect(() => {
    if (!playlist || playlist.creatorId !== parseInt(userId)) {
      alert("You are not authorized to edit this playlist");
      navigate("/playlistfeed");
    }
  }, [playlist, userId, navigate]);

  const [name, setName] = useState(playlist?.name || "");
  const [genre, setGenre] = useState(playlist?.genre || "");
  const [coverImage, setCoverImage] = useState(playlist?.coverImage || "");
  const [description, setDescription] = useState(playlist?.description || "");
  const [hashtags, setHashtags] = useState(playlist?.hashtags.join(", ") || "");
  const [playlistSongs, setPlaylistSongs] = useState(playlist?.songs || []);

  // Update playlist details
  const handleSaveChanges = () => {
    const updatedHashtags = hashtags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    const updatedPlaylist = {
      ...playlist,
      name,
      genre,
      coverImage,
      description,
      hashtags: updatedHashtags,
      songs: playlistSongs,
    };

    const updatedPlaylists = playlists.map((pl) =>
      pl.id === parseInt(playlistid) ? updatedPlaylist : pl
    );

    setPlaylists(updatedPlaylists);
    navigate(`/playlist/${playlistid}`);
  };

  // Handle song removal
  const handleRemoveSong = (songId) => {
    setPlaylistSongs(playlistSongs.filter((id) => id !== songId));
  };

  // Handle playlist deletion
  const handleDeletePlaylist = () => {
    const updatedPlaylists = playlists.filter(
      (pl) => pl.id !== parseInt(playlistid)
    );
    setPlaylists(updatedPlaylists);
    navigate("/playlistfeed");
  };

  return (
    <div className="container mt-5">
      <h1>Edit Playlist</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Playlist Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="genre" className="form-label">
            Genre
          </label>
          <select
            className="form-select"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          >
            <option value="">Select a genre</option>
            {genres.map((g, index) => (
              <option key={index} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="coverImage" className="form-label">
            Cover Image URL
          </label>
          <input
            type="url"
            className="form-control"
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="hashtags" className="form-label">
            Hashtags (comma-separated)
          </label>
          <input
            type="text"
            className="form-control"
            id="hashtags"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />
        </div>

        <h3>Reorder or Remove Songs</h3>
        {playlistSongs.length > 0 ? (
          <ul className="list-group mb-3">
            {playlistSongs.map((songId, index) => {
              const song = songs.find((s) => s.id === songId);
              return (
                <li
                  key={songId}
                  className="list-group-item d-flex justify-content-between"
                >
                  <div>
                    <strong>
                      {index + 1}. {song?.name || "Unknown Song"}
                    </strong>{" "}
                    by {song?.artist || "Unknown Artist"}
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveSong(songId)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No songs in this playlist.</p>
        )}

        <button
          type="button"
          className="btn btn-success me-2"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDeletePlaylist}
        >
          Delete Playlist
        </button>
        <Link to={`/playlist/${playlistid}`} className="btn btn-secondary ms-2">
          Cancel
        </Link>
      </form>
    </div>
  );
};

export default EditPlaylist;
