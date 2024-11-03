import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";

const AddSongPage = () => {
  const { addNewSong, songs, authenticatedUser } = useContext(PlaylistContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const nameRef = useRef(null);
  const artistRef = useRef(null);
  const linkRef = useRef(null);

  const validateSpotifyUrl = (url) => {
    const spotifyUrlPattern =
      /^https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]{22}/;
    return spotifyUrlPattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = nameRef.current.value.trim();
    const artist = artistRef.current.value.trim();
    const link = linkRef.current.value.trim();

    // Validate required fields
    if (!name || !artist || !link) {
      setError("All fields are required");
      return;
    }

    // Validate Spotify URL
    if (!validateSpotifyUrl(link)) {
      setError("Please enter a valid Spotify track URL");
      return;
    }

    try {
      // Check if song exists by link
      const existingSong = songs.find((song) => song.link === link);

      if (existingSong && !existingSong.isDeleted) {
        setError("This song already exists in the system.");
        return;
      }

      // Create new song object
      const newSong = {
        name,
        artist,
        link,
        creatorId: authenticatedUser._id,
      };

      // Use the context function to add the song
      await addNewSong(newSong);
      navigate("/home?tab=songs");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Add a New Song</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="needs-validation">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Song Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            ref={nameRef}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="artist" className="form-label">
            Artist
          </label>
          <input
            type="text"
            className="form-control"
            id="artist"
            ref={artistRef}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="link" className="form-label">
            Spotify Link
          </label>
          <input
            type="url"
            className="form-control"
            id="link"
            ref={linkRef}
            placeholder="https://open.spotify.com/track/..."
            required
          />
          <div className="form-text">
            Enter the Spotify track URL (e.g.,
            https://open.spotify.com/track/...)
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Song
        </button>
      </form>
    </div>
  );
};

export default AddSongPage;
