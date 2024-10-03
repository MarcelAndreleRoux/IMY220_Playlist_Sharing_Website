import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import NavBar from "./NavBar";

const AddSongToPlaylistPage = () => {
  const { playlists, songs, addSongToPlaylist } = useContext(PlaylistContext);
  const { songid } = useParams();
  const navigate = useNavigate();

  const selectedSong = songs?.find((song) => song.id === parseInt(songid));

  // If song is not found, show a message and navigate back
  if (!selectedSong) {
    return (
      <div className="container mt-5">
        <h1>Song not found</h1>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const handleAddSong = (playlistId) => {
    const playlist = playlists.find((pl) => pl.id === playlistId);

    if (!playlist) {
      alert("Playlist not found.");
      return;
    }

    const songAlreadyInPlaylist = playlist.songs?.includes(selectedSong.id);

    if (songAlreadyInPlaylist) {
      // Navigate to the playlist page if the song already exists
      alert(`"${selectedSong.name}" is already in "${playlist.name}".`);
      navigate(`/playlist/${playlistId}`);
    } else {
      // Add song to the playlist and navigate to the playlist page
      addSongToPlaylist(playlistId, selectedSong);
      navigate(`/playlist/${playlistId}`);
    }
  };

  return (
    <>
      <NavBar /> {/* Assuming a NavBar component */}
      <div className="container mt-5">
        <h1>Add "{selectedSong.name}" to Your Playlist</h1>
        <h3>Select a Playlist:</h3>

        {playlists.length > 0 ? (
          <div className="list-group">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="list-group-item">
                <h4>{playlist.name}</h4>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddSong(playlist.id)}
                >
                  {playlist.songs?.includes(selectedSong.id)
                    ? "Go to Playlist"
                    : `Add Song to ${playlist.name}`}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No playlists available. Create one to add this song!</p>
        )}
      </div>
    </>
  );
};

export default AddSongToPlaylistPage;
