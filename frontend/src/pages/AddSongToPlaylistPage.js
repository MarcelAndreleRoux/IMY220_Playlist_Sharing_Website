import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import NavBar from "../components/NavBar";

const AddSongToPlaylistPage = () => {
  const { playlists, songs, authenticatedUser, addSongToPlaylist } =
    useContext(PlaylistContext);
  const { songid } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const selectedSong = songs?.find(
    (song) => song._id === songid && !song.isDeleted
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
      await addSongToPlaylist(playlistId, selectedSong._id);
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

          <div className="alert alert-info">
            <p>Create New Playlist</p>
            <Link to="/create_playlist" className="btn btn-primary">
              Create New Playlist
            </Link>
          </div>

          {playlists.filter((p) => p.creatorId === authenticatedUser._id)
            .length > 0 ? (
            <div className="list-group">
              {playlists
                .filter((p) => p.creatorId === authenticatedUser._id)
                .map((playlist) => (
                  <div key={playlist._id} className="list-group-item">
                    <h4>{playlist.name}</h4>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddSong(playlist._id)}
                      disabled={(playlist.songs || []).includes(
                        selectedSong._id
                      )}
                    >
                      {(playlist.songs || []).includes(selectedSong._id)
                        ? "Already in Playlist"
                        : `Add to ${playlist.name}`}
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="alert alert-info">
              <p>No playlists available. Create one to add this song!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddSongToPlaylistPage;
