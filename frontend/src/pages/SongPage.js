// Song can be added to a new playlist or selected playlist

import React, { useContext, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";
import SpotifyEmbed from "../components/SpotifyEmbed";
import NavBar from "../components/NavBar";

const SongPage = () => {
  const navigate = useNavigate();
  const { songid } = useParams();
  const { songs, users, authenticatedUser, setPlaylists, setSongs } =
    useContext(PlaylistContext);
  const [error, setError] = useState("");

  // Find song by MongoDB _id
  const song = songs.find((s) => s._id === songid);
  const songCreator = users.find((u) => u._id === song?.creatorId);

  const canDelete =
    authenticatedUser &&
    (authenticatedUser._id === song?.creatorId ||
      authenticatedUser.role === "admin");

  if (!song) {
    return (
      <>
        <NavBar />
        <div className="container mt-5">
          <div className="alert alert-warning">Song not found</div>
        </div>
      </>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this song?")) {
      return;
    }

    try {
      const response = await fetch(`/api/songs/${song._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDeleted: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete song");
      }

      setSongs((prevSongs) =>
        prevSongs.map((s) =>
          s._id === song._id ? { ...s, isDeleted: true } : s
        )
      );

      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) => ({
          ...playlist,
          songs:
            playlist.songs?.map((songId) =>
              songId === song._id ? { id: songId, isDeleted: true } : songId
            ) || [],
        }))
      );

      setTimeout(() => {
        navigate("/home?tab=songs");
      }, 100);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        {error && <div className="alert alert-danger">{error}</div>}

        <div
          className={`card ${song.isDeleted ? "bg-light border-danger" : ""}`}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h1
                  className={`card-title ${song.isDeleted ? "text-muted" : ""}`}
                >
                  {song.name}
                  {song.isDeleted && (
                    <span className="badge bg-danger ms-2">Deleted</span>
                  )}
                </h1>
                <h3 className="card-subtitle mb-2 text-muted">{song.artist}</h3>
              </div>
              {canDelete && !song.isDeleted && (
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete Song
                </button>
              )}
            </div>

            <div className="mt-3">
              <p className="card-text">
                Added by: {songCreator?.username || "Unknown user"}
              </p>
              <p className="card-text">
                Added on: {new Date(song.createdAt).toLocaleDateString()}
              </p>
              <p className="card-text">
                Added to {song.addedToPlaylistsCount} playlists
              </p>
            </div>

            <div className="mt-4">
              <SpotifyEmbed songLink={song.link} />
            </div>

            <div className="mt-4">
              {!song.isDeleted && (
                <Link
                  to={`/addtoplaylist/${song.id}`}
                  className="btn btn-primary me-2"
                >
                  Add to Playlist
                </Link>
              )}
              <Link to="/home?tab=songs" className="btn btn-secondary">
                Back to Songs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SongPage;
