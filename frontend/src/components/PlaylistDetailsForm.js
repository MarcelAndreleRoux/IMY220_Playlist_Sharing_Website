import React from "react";
import ImageUploader from "./ImageUploader";

const PlaylistDetailsForm = ({
  name,
  setName,
  genre,
  setGenre,
  coverImage,
  setCoverImage,
  description,
  setDescription,
  hashtags,
  setHashtags,
  genres,
  onImageSelect, // New prop for handling image file
}) => {
  return (
    <div className="mb-4">
      <div className="form-group mb-3">
        <label htmlFor="playlist-name">Name</label>
        <input
          type="text"
          id="playlist-name"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="playlist-genre">Genre</label>
        <select
          id="playlist-genre"
          className="form-control"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        >
          <option value="">Select a genre</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group mb-3">
        <label>Cover Image</label>
        <ImageUploader
          currentImage={coverImage}
          onImageSelect={onImageSelect}
          className="mt-2"
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="playlist-description">Description</label>
        <textarea
          id="playlist-description"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="playlist-hashtags">Hashtags (comma-separated)</label>
        <input
          type="text"
          id="playlist-hashtags"
          className="form-control"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="e.g., rock, summer, roadtrip"
        />
      </div>
    </div>
  );
};

export default PlaylistDetailsForm;
