import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";
import ImageUploader from "../components/ImageUploader";

const AddToPlaylistPage = () => {
  const {
    genres,
    setUsers,
    setPlaylists,
    authenticatedUser,
    setAuthenticatedUser,
  } = useContext(PlaylistContext);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextPlaylistNumber, setNextPlaylistNumber] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    description: "",
    hashtags: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (authenticatedUser?.created_playlists) {
      setNextPlaylistNumber(authenticatedUser.created_playlists.length + 1);
      setFormData((prev) => ({
        ...prev,
        name: `New Playlist #${authenticatedUser.created_playlists.length + 1}`,
      }));
    }
  }, [authenticatedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (file) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!authenticatedUser) {
        throw new Error("User not authenticated");
      }

      if (!formData.genre) {
        throw new Error("Please select a genre");
      }

      // Handle image upload first if there is one
      let coverImageUrl = DefaultImage;
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const imageResponse = await fetch(`/api/playlists/temp/image`, {
          method: "POST",
          body: imageFormData,
        });

        if (!imageResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const imageData = await imageResponse.json();
        coverImageUrl = imageData.imageUrl;
      }

      const newPlaylist = {
        name: formData.name || `New Playlist #${nextPlaylistNumber}`,
        genre: formData.genre,
        coverImage: coverImageUrl,
        description: formData.description || "No description provided.",
        creatorId: authenticatedUser._id,
        hashtags: formData.hashtags
          ? formData.hashtags.split(",").map((tag) => tag.trim())
          : [],
        creationDate: new Date().toISOString(),
        songs: [],
        followers: [authenticatedUser._id],
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

      const { result: createdPlaylist } = await response.json();

      setPlaylists((prevPlaylists) => [...prevPlaylists, createdPlaylist]);

      const updatedUser = {
        ...authenticatedUser,
        created_playlists: [
          ...(authenticatedUser.created_playlists || []),
          createdPlaylist._id,
        ],
        playlists: [
          ...(authenticatedUser.playlists || []),
          createdPlaylist._id,
        ],
      };

      const userResponse = await fetch(`/api/users/${authenticatedUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          created_playlists: updatedUser.created_playlists,
          playlists: updatedUser.playlists,
        }),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to update user's playlists");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === authenticatedUser._id ? updatedUser : user
        )
      );

      setAuthenticatedUser(updatedUser);
      sessionStorage.setItem("authenticatedUser", JSON.stringify(updatedUser));

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
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={`New Playlist #${nextPlaylistNumber}`}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="genre" className="form-label">
            Genre
          </label>
          <select
            className="form-select"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          >
            <option value="">Select a genre</option>
            {genres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Cover Image</label>
          <ImageUploader
            currentImage={imagePreview}
            onImageSelect={handleImageSelect}
            className="mt-2"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description (optional)
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
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
            name="hashtags"
            value={formData.hashtags}
            onChange={handleChange}
            placeholder="e.g., #chill, #workout"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div>Saving playlist...</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Playlist"}
        </button>
      </form>

      <button onClick={() => navigate(-1)} className="btn btn-link mt-3">
        Back to Playlist List
      </button>
    </div>
  );
};

export default AddToPlaylistPage;
