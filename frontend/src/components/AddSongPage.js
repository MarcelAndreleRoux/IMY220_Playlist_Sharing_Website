import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";

const AddSongPage = () => {
  const { addNewSong, authenticatedUser } = useContext(PlaylistContext);
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
      // Check if a song with this link already exists (including deleted ones)
      const existingSong = songs.find((song) => song.link === link);

      if (existingSong) {
        if (existingSong.isDeleted) {
          // If song exists but was deleted, restore it
          const response = await fetch(`/api/songs/${existingSong.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isDeleted: false,
              name,
              artist,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to restore song");
          }

          const updatedSong = await response.json();
          setSongs((prevSongs) =>
            prevSongs.map((song) =>
              song.id === existingSong.id ? updatedSong : song
            )
          );
        } else {
          setError("This song already exists in the system.");
          return;
        }
      } else {
        // Create new song if it doesn't exist
        const newSong = {
          name,
          artist,
          link,
          creatorId: authenticatedUser.userId,
          createdAt: new Date().toISOString(),
          addedToPlaylistsCount: 0,
          isDeleted: false,
        };

        const response = await fetch("/api/songs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSong),
        });

        if (!response.ok) {
          throw new Error("Failed to add song");
        }

        const addedSong = await response.json();
        addNewSong(addedSong);
      }

      navigate("/songfeed");
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
