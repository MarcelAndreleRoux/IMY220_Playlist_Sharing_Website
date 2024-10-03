import React from "react";

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
}) => {
  return (
    <>
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
      </form>
    </>
  );
};

export default PlaylistDetailsForm;
