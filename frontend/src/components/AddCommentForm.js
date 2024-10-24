import React, { useState, useRef } from "react";

const AddCommentForm = ({ playlistId, setPlaylists }) => {
  const [commentText, setCommentText] = useState("");
  const [stars, setStars] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const dropRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!commentText || stars === 0) {
      setError("Please fill in the comment and rate with stars.");
      return;
    }

    const newComment = {
      id: Date.now(),
      userId: JSON.parse(localStorage.getItem("authenticatedUser")).userId,
      text: commentText,
      stars,
      image: imagePreview,
      likes: 0,
    };

    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((pl) =>
        pl.id === playlistId
          ? { ...pl, comments: [...pl.comments, newComment] }
          : pl
      )
    );

    setCommentText("");
    setStars(0);
    setImagePreview(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows="4"
          placeholder="Write your comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          min="1"
          max="5"
          value={stars}
          onChange={(e) => setStars(parseInt(e.target.value))}
          placeholder="Rate (1-5)"
          required
        />
      </div>
      <div
        ref={dropRef}
        className="border p-3 mb-3"
        style={{ height: "150px", width: "100%", textAlign: "center" }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="img-fluid" />
        ) : (
          <p>Drag and drop an image or GIF here</p>
        )}
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button type="submit" className="btn btn-primary">
        Add Comment
      </button>
    </form>
  );
};

export default AddCommentForm;
