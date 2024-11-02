import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import NavBar from "./NavBar";

const AddSongToPlaylistPage = () => {
  const { playlists, songs, authenticatedUser } = useContext(PlaylistContext);
  const { songid } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const selectedSong = songs?.find(
    (song) => song.id === parseInt(songid) && !song.isDeleted
  );

  if (!selectedSong) {
    return (
      <>
        <NavBar />
        <div className="container mt-5">
          <div className="alert alert-warning">
            This song is no longer available
            <button
              className="btn btn-primary ms-3"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  const handleAddSong = async (playlistId) => {
    try {
      const playlist = playlists.find((pl) => pl.id === playlistId);

      if (!playlist) {
        throw new Error("Playlist not found");
      }

      // Add null check and default to empty array if songs is undefined
      const currentSongs = playlist.songs || [];

      // Check if song is already in playlist
      const songAlreadyInPlaylist = currentSongs.includes(selectedSong.id);
      if (songAlreadyInPlaylist) {
        navigate(`/playlist/${playlistId}`);
        return;
      }

      // Add song to playlist, using the currentSongs array we validated above
      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          songs: [...currentSongs, selectedSong.id],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add song to playlist");
      }

      // Update song's addedToPlaylistsCount
      await fetch(`/api/songs/${selectedSong.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addedToPlaylistsCount: (selectedSong.addedToPlaylistsCount || 0) + 1,
        }),
      });

      navigate(`/playlist/${playlistId}`);
    } catch (err) {
      setError(err.message);
      console.error("Error adding song to playlist:", err);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        {error && <div className="alert alert-danger">{error}</div>}
        <div>
          <h1>Add "{selectedSong.name}" to Your Playlist</h1>
          <h3>Select a Playlist:</h3>

          {playlists.filter((p) => p.creatorId === authenticatedUser.userId)
            .length > 0 ? (
            <div className="list-group">
              {playlists
                .filter((p) => p.creatorId === authenticatedUser.userId)
                .map((playlist) => (
                  <div key={playlist.id} className="list-group-item">
                    <h4>{playlist.name}</h4>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddSong(playlist.id)}
                      disabled={(playlist.songs || []).includes(
                        selectedSong.id
                      )}
                    >
                      {(playlist.songs || []).includes(selectedSong.id)
                        ? "Already in Playlist"
                        : `Add to ${playlist.name}`}
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="alert alert-info">
              <p>No playlists available. Create one to add this song!</p>
              <Link to="/create_playlist" className="btn btn-primary">
                Create New Playlist
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddSongToPlaylistPage;
