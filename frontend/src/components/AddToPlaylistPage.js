import React, { useRef, useState, useContext, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";

const AddToPlaylistPage = () => {
  const { genres, setUsers, setPlaylists } = useContext(PlaylistContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const nameRef = useRef(null);
  const genreRef = useRef(null);
  const coverImageRef = useRef(null);
  const descriptionRef = useRef(null);
  const hashtagsRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const authenticatedUser = JSON.parse(
        sessionStorage.getItem("authenticatedUser")
      );

      if (!authenticatedUser) {
        throw new Error("User not authenticated");
      }

      const name = nameRef.current.value || "New Playlist";
      const genre = genreRef.current.value;
      const coverImage = coverImageRef.current.value;
      const description =
        descriptionRef.current.value || "No description provided.";
      const hashtags = hashtagsRef.current.value;

      if (!genre) {
        throw new Error("Please select a genre");
      }

      const newPlaylist = {
        name,
        genre,
        coverImage: coverImage || DefaultImage,
        description,
        creatorId: authenticatedUser.userId,
        hashtags: hashtags ? hashtags.split(",").map((tag) => tag.trim()) : [],
        creationDate: new Date().toISOString(),
        songs: [],
        followers: [authenticatedUser.userId],
        comments: [],
      };

      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlaylist),
      });

      if (!response.ok) {
        throw new Error("Failed to create playlist");
      }

      const savedPlaylist = await response.json();

      // Update playlists context
      setPlaylists((prevPlaylists) => [...prevPlaylists, savedPlaylist]);

      // Update user's created_playlists array
      const updatedUser = {
        ...authenticatedUser,
        created_playlists: [
          ...(authenticatedUser.created_playlists || []),
          newPlaylistId,
        ],
      };

      // Update user in the database
      const userResponse = await fetch(
        `/api/users/${authenticatedUser.userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            created_playlists: updatedUser.created_playlists,
          }),
        }
      );

      if (!userResponse.ok) {
        throw new Error("Failed to update user's playlists");
      }

      // Update users context and session storage
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === authenticatedUser.userId ? updatedUser : user
        )
      );
      sessionStorage.setItem("authenticatedUser", JSON.stringify(updatedUser));

      // Navigate to the user's playlists page
      navigate(`/my_playlists/${authenticatedUser.username}`);
    } catch (err) {
      setError(err.message || "Failed to create playlist");
      console.error("Error creating playlist:", err);
    } finally {
      setLoading(false);
    }
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
            placeholder={`New Playlist #${playlistCount + 1}`}
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
        {loading && <div>Saving playlist...</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Playlist"}
        </button>
      </form>

      <NavLink to="/home?tab=playlists" className="btn btn-link mt-3">
        Back to Playlist List
      </NavLink>
    </div>
  );
};

export default AddToPlaylistPage;
