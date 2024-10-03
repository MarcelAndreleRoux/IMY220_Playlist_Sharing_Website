import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";

const AddSongPage = () => {
  const { songs = [], addNewSong } = useContext(PlaylistContext);

  const nameRef = useRef(null);
  const artistRef = useRef(null);
  const linkRef = useRef(null);
  const genreRef = useRef(null);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = nameRef.current.value.trim();
    const artist = artistRef.current.value.trim();
    const link = linkRef.current.value.trim();
    const genre = genreRef.current.value.trim();

    // Check if any fields are empty
    if (!name || !artist || !link) {
      setError("Please fill in all the required fields.");
      return;
    }

    // Check if the song already exists
    const songExists = songs.some(
      (song) =>
        song.name.toLowerCase() === name.toLowerCase() &&
        song.artist.toLowerCase() === artist.toLowerCase()
    );

    if (songExists) {
      setError("This song already exists in the system.");
      return;
    }

    // Create new song object
    const newSong = {
      id: Date.now(),
      name,
      artist,
      link,
      genre,
    };

    // Add new song to the list
    addNewSong(newSong);

    // Clear the form fields
    nameRef.current.value = "";
    artistRef.current.value = "";
    linkRef.current.value = "";
    genreRef.current.value = "";

    // Redirect to the song feed after submission
    navigate("/songfeed");
  };

  return (
    <div className="container mt-5">
      <h1>Add a New Song</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Song Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            ref={nameRef}
            placeholder="Enter song name"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="artist" className="form-label">
            Artist <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="artist"
            ref={artistRef}
            placeholder="Enter artist name"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="link" className="form-label">
            Spotify Link <span className="text-danger">*</span>
          </label>
          <input
            type="url"
            className="form-control"
            id="link"
            ref={linkRef}
            placeholder="Enter Spotify song link"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="genre" className="form-label">
            Genre (optional)
          </label>
          <input
            type="text"
            className="form-control"
            id="genre"
            ref={genreRef}
            placeholder="Enter genre"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary">
          Add Song
        </button>
      </form>
    </div>
  );
};

export default AddSongPage;
