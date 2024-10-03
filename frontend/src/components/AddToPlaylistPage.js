import React, { useRef, useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";

const AddToPlaylistPage = () => {
  const { genres, addNewPlaylist, users, setUsers } =
    useContext(PlaylistContext);

  const nameRef = useRef(null);
  const genreRef = useRef(null);
  const coverImageRef = useRef(null);
  const descriptionRef = useRef(null);
  const hashtagsRef = useRef(null);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = nameRef.current.value;
    const genre = genreRef.current.value;
    const coverImage = coverImageRef.current.value;
    const description = descriptionRef.current.value;
    const hashtags = hashtagsRef.current.value;

    const userId = localStorage.getItem("userId");
    const currentUser = users.find((user) => user.userId === parseInt(userId));

    // Basic validation
    if (!name || !genre) {
      setError("Please fill in all required fields (name and genre).");
      return;
    }

    // Create a new playlist object
    const newPlaylist = {
      id: Date.now(),
      name,
      genre,
      coverImage: coverImage || DefaultImage, // Default cover image
      description: description || "No description provided.",
      creatorId: parseInt(userId),
      hashtags: hashtags ? hashtags.split(",").map((tag) => tag.trim()) : [],
      creationDate: new Date().toISOString(),
    };

    // Ensure `users` is defined before proceeding
    if (!users || users.length === 0) {
      setError("User data is not available.");
      return;
    }

    // Add new playlist to the global playlist state
    addNewPlaylist(newPlaylist);

    if (currentUser) {
      // Update user's playlists
      const updatedUser = {
        ...currentUser,
        playlists: [...(currentUser.playlists || []), newPlaylist],
      };

      const updatedUsers = users.map((user) =>
        user.userId === parseInt(userId) ? updatedUser : user
      );

      // Update users state
      setUsers(updatedUsers);
    } else {
      setError("User not found.");
      return;
    }

    // Navigate to playlist feed after playlist creation
    navigate("/playlistfeed");
  };

  return (
    <div className="container mt-5">
      <h1>Create a New Playlist</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Playlist Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            ref={nameRef}
            placeholder="Enter playlist name"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="genre" className="form-label">
            Genre
          </label>
          <select className="form-select" id="genre" ref={genreRef} required>
            <option value="">Select a genre</option>
            {genres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="coverImage" className="form-label">
            Cover Image URL (optional)
          </label>
          <input
            type="url"
            className="form-control"
            id="coverImage"
            ref={coverImageRef}
            placeholder="Enter image URL"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description (optional)
          </label>
          <textarea
            className="form-control"
            id="description"
            ref={descriptionRef}
            placeholder="Enter playlist description"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="hashtags" className="form-label">
            Hashtags (optional, separated by commas)
          </label>
          <input
            type="text"
            className="form-control"
            id="hashtags"
            ref={hashtagsRef}
            placeholder="e.g., #chill, #workout"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary">
          Create Playlist
        </button>
      </form>

      <NavLink to="/playlistfeed" className="btn btn-link mt-3">
        Back to Playlist List
      </NavLink>
    </div>
  );
};

export default AddToPlaylistPage;
