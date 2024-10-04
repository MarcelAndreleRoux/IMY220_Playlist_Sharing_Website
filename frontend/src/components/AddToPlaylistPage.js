import React, { useRef, useState, useContext, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [playlistCount, setPlaylistCount] = useState(0); // To store the playlist count
  const navigate = useNavigate();

  // Fetch playlist count on component mount
  useEffect(() => {
    const fetchPlaylistCount = async () => {
      try {
        const response = await fetch("/api/playlists", { method: "GET" });
        if (!response.ok) {
          throw new Error("Error fetching playlists.");
        }
        const { count } = await response.json(); // Get the count from the response
        setPlaylistCount(count); // Set the playlist count
      } catch (error) {
        console.error("Error fetching playlist count:", error);
        setError("Failed to fetch playlist count.");
      }
    };

    fetchPlaylistCount();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const name = nameRef.current.value;
    const genre = genreRef.current.value;
    const coverImage = coverImageRef.current.value;
    const description = descriptionRef.current.value;
    const hashtags = hashtagsRef.current.value;

    const userId = localStorage.getItem("userId");
    const currentUser = users.find((user) => user.userId === parseInt(userId));

    if (!name || !genre) {
      setError("Please fill in all required fields (name and genre).");
      setLoading(false);
      return;
    }

    // Generate new playlist id based on the playlist count + 1
    const newPlaylistId = playlistCount + 1;

    // Create a new playlist object with the generated id
    const newPlaylist = {
      id: newPlaylistId,
      name,
      genre,
      coverImage: coverImage || DefaultImage,
      description: description || "No description provided.",
      creatorId: parseInt(userId),
      hashtags: hashtags ? hashtags.split(",").map((tag) => tag.trim()) : [],
      creationDate: new Date().toISOString(),
    };

    if (!currentUser) {
      setError("User not found.");
      setLoading(false);
      return;
    }

    try {
      // Send POST request to the backend API to save the playlist
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlaylist),
      });

      if (!response.ok) {
        throw new Error("Failed to save the playlist in the database");
      }

      const savedPlaylist = await response.json();

      // Add the saved playlist to the global playlist state
      addNewPlaylist(savedPlaylist);

      // Update user's playlists
      const updatedUser = {
        ...currentUser,
        playlists: [...(currentUser.playlists || []), savedPlaylist],
      };

      const updatedUsers = users.map((user) =>
        user.userId === parseInt(userId) ? updatedUser : user
      );

      setUsers(updatedUsers);

      // Navigate to playlist feed after playlist creation
      navigate("/playlistfeed");
    } catch (err) {
      setError(err.message || "An error occurred while saving the playlist.");
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
        {loading && <div>Saving playlist...</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Playlist"}
        </button>
      </form>

      <NavLink to="/playlistfeed" className="btn btn-link mt-3">
        Back to Playlist List
      </NavLink>
    </div>
  );
};

export default AddToPlaylistPage;
