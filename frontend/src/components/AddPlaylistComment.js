import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddPlaylistComment = ({ playlists, setPlaylists, users }) => {
  const { playlistid } = useParams();
  const [error, setError] = useState("");
  const [stars, setStars] = useState(0);
  const commentRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const currentUser = users.find((user) => user.userId === parseInt(userId));

  if (!currentUser) {
    return <p>User not found. Please log in.</p>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const commentText = commentRef.current.value;
    const uploadedImage = imageRef.current.files[0];

    if (!commentText || stars === 0) {
      setError("Please fill in the comment and rate with stars.");
      return;
    }

    const newComment = {
      id: Date.now(),
      userId: currentUser.userId,
      text: commentText,
      stars: stars,
      image: uploadedImage ? URL.createObjectURL(uploadedImage) : null,
    };

    // Find the playlist and add the comment
    const updatedPlaylists = playlists.map((playlist) => {
      if (playlist.id === parseInt(playlistid)) {
        // Initialize comments array if it's undefined
        const comments = playlist.comments || [];
        return {
          ...playlist,
          comments: [...comments, newComment],
        };
      }
      return playlist;
    });

    setPlaylists(updatedPlaylists);

    // Navigate back to the playlist page
    navigate(`/playlist/${playlistid}`);
  };

  return (
    <div className="container mt-5">
      <h1>Add a Comment</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="comment" className="form-label">
            Comment
          </label>
          <textarea
            className="form-control"
            id="comment"
            ref={commentRef}
            rows="4"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="stars" className="form-label">
            Rate (1-5 stars)
          </label>
          <input
            type="number"
            className="form-control"
            id="stars"
            value={stars}
            onChange={(e) => setStars(parseInt(e.target.value))}
            min="1"
            max="5"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Upload an Image (optional)
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            ref={imageRef}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary">
          Add Comment
        </button>
      </form>
    </div>
  );
};

export default AddPlaylistComment;
