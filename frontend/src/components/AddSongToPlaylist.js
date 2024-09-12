import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const AddSongToPlaylistPage = ({ playlists, addSongToPlaylist, songs }) => {
  const { songid } = useParams();
  const selectedSong = songs.find((song) => song.id === parseInt(songid));
  const navigate = useNavigate(); // Initialize useNavigate hook

  if (!selectedSong) {
    return <div>Song not found</div>;
  }

  const handleAddSong = (playlistId) => {
    const playlist = playlists.find((pl) => pl.id === playlistId);

    // Safely check if the playlist.songs is defined and includes the selected song
    const songAlreadyInPlaylist = playlist?.songs?.includes(selectedSong.id);

    if (songAlreadyInPlaylist) {
      // If song exists, navigate directly to the playlist page
      navigate(`/playlist/${playlistId}`);
    } else {
      // Add song to the playlist and navigate to the playlist page
      addSongToPlaylist(playlistId, selectedSong);
      navigate(`/playlist/${playlistId}`);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Add "{selectedSong.name}" to Your Playlist</h1>

      <h3>Select a Playlist:</h3>
      <div className="list-group">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="list-group-item">
            <h4>{playlist.name}</h4>
            <button
              className="btn btn-primary"
              onClick={() => handleAddSong(playlist.id)}
            >
              {playlist?.songs?.includes(selectedSong.id)
                ? "Go to Playlist"
                : `Add Song to ${playlist.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddSongToPlaylistPage;
